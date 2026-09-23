-- place_order: precio por combinación de seleccionables (products.options / products.variants).
-- Cada ítem puede traer "selection" ({"Medida": "150x70", "Color": "Roble"}). El precio se recalcula
-- acá, no se toma del navegador: si el producto tiene seleccionables que cambian el precio, la
-- selección es obligatoria y se usa el precio de su combinación (sin fila cargada = precio base).
-- Es un create or replace de la función de 20260921180000: misma firma y mismas validaciones
-- (stock, ráfagas, envío por zona); para productos sin seleccionables el resultado es idéntico.

create or replace function public.place_order(
  p_customer text,
  p_phone text,
  p_zip text,
  p_items jsonb
)
returns table (out_number bigint, out_subtotal numeric, out_shipping numeric, out_total numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subtotal numeric := 0;
  v_shipping numeric;
  v_items jsonb := '[]'::jsonb;
  v_summary text[] := '{}';
  v_item jsonb;
  v_qty integer;
  v_prod record;
  v_number bigint;
  v_sel jsonb;
  v_opt jsonb;
  v_price numeric;
  v_label text;
  v_has_price_opts boolean;
begin
  if coalesce(trim(p_customer), '') = '' or length(p_customer) > 100 then
    raise exception 'invalid_customer';
  end if;
  if length(coalesce(p_phone, '')) > 40 then
    raise exception 'invalid_phone';
  end if;
  if p_zip is null or p_zip !~ '^[0-9]{4}$' then
    raise exception 'invalid_zip';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'invalid_items';
  end if;

  if (select count(*) from public.orders where source = 'web' and created_at > now() - interval '10 minutes') >= 20 then
    raise exception 'too_many_orders';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    begin
      v_qty := (v_item ->> 'qty')::integer;
    exception when others then
      raise exception 'invalid_items';
    end;
    if v_qty is null or v_qty < 1 or v_qty > 99 then
      raise exception 'invalid_items';
    end if;

    select slug, name, price, stock_status, options, variants into v_prod
    from public.products
    where slug = v_item ->> 'slug' and active = true;
    if not found then
      raise exception 'unknown_product';
    end if;
    if v_prod.stock_status = 'sin_stock' then
      raise exception 'out_of_stock';
    end if;

    v_price := v_prod.price;
    v_label := null;
    v_sel := v_item -> 'selection';
    if v_sel is not null and jsonb_typeof(v_sel) <> 'object' then
      raise exception 'invalid_selection';
    end if;

    if jsonb_array_length(coalesce(v_prod.options, '[]'::jsonb)) > 0 then
      -- Cada seleccionable del producto necesita una opción válida.
      for v_opt in select * from jsonb_array_elements(v_prod.options) loop
        if v_sel is null or not (v_opt -> 'values') ? (v_sel ->> (v_opt ->> 'name')) then
          raise exception 'invalid_selection';
        end if;
      end loop;

      select string_agg((o ->> 'name') || ': ' || (v_sel ->> (o ->> 'name')), ' · ')
      into v_label
      from jsonb_array_elements(v_prod.options) o;

      v_has_price_opts := exists (select 1 from jsonb_array_elements(v_prod.options) o where coalesce((o ->> 'affectsPrice')::boolean, false));
      if v_has_price_opts then
        -- La combinación de la variante está contenida en la selección (que trae todas las opciones).
        select (var ->> 'price')::numeric into v_price
        from jsonb_array_elements(coalesce(v_prod.variants, '[]'::jsonb)) var
        where (var -> 'combo') <@ v_sel
        limit 1;
        v_price := coalesce(v_price, v_prod.price);
      end if;
    end if;

    v_subtotal := v_subtotal + v_price * v_qty;
    v_items := v_items || jsonb_strip_nulls(jsonb_build_object('slug', v_prod.slug, 'name', v_prod.name, 'price', v_price, 'qty', v_qty, 'selection', v_label));
    v_summary := v_summary || (v_prod.name || coalesce(' (' || v_label || ')', '') || ' ×' || v_qty);
  end loop;

  select z.price into v_shipping
  from public.shipping_zones z
  where not z.is_default and p_zip::integer between z.cp_from and z.cp_to
  order by z.sort_order
  limit 1;

  if v_shipping is null then
    select z.price into v_shipping from public.shipping_zones z where z.is_default;
  end if;
  v_shipping := coalesce(v_shipping, 0);

  insert into public.orders (customer, phone, zip, items, summary, subtotal, shipping, total, source)
  values (trim(p_customer), nullif(trim(coalesce(p_phone, '')), ''), p_zip, v_items, array_to_string(v_summary, ', '), v_subtotal, v_shipping, v_subtotal + v_shipping, 'web')
  returning orders.number into v_number;

  return query select v_number, v_subtotal, v_shipping, v_subtotal + v_shipping;
end;
$$;

revoke all on function public.place_order(text, text, text, jsonb) from public;
grant execute on function public.place_order(text, text, text, jsonb) to anon, authenticated;

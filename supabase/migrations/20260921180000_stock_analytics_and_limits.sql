-- Stock por producto, origen de los pedidos, estadísticas de uso y tope anti-spam.
--
-- products.stock_status: 'disponible' | 'a_pedido' | 'sin_stock'. place_order rechaza los sin stock.
-- orders.source: 'web' (carrito) o 'manual' (cargado por el admin).
-- events + track_event(): visitas, clics en WhatsApp y altas al carrito, sin datos personales ni cookies.
-- analytics_summary(): resumen para el panel de estadísticas (solo lo puede leer un admin).
-- place_order(): además del stock, corta ráfagas de pedidos (máx. 20 en 10 minutos en todo el sitio).

-- =========================================================
-- Stock
-- =========================================================

alter table public.products
  add column if not exists stock_status text not null default 'disponible'
  check (stock_status in ('disponible', 'a_pedido', 'sin_stock'));

-- =========================================================
-- Origen del pedido
-- =========================================================

alter table public.orders
  add column if not exists source text not null default 'web'
  check (source in ('web', 'manual'));

-- =========================================================
-- Eventos de uso
-- =========================================================

create table if not exists public.events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('page_view', 'whatsapp_click', 'add_to_cart')),
  path text not null check (length(path) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_type_idx on public.events (type, created_at desc);

alter table public.events enable row level security;

-- Sin policies para anon: los visitantes solo pueden registrar eventos vía track_event().
create policy "events_select_authenticated"
  on public.events for select
  to authenticated
  using (true);

create or replace function public.track_event(p_type text, p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_type not in ('page_view', 'whatsapp_click', 'add_to_cart') then
    return;
  end if;
  if p_path is null or left(p_path, 1) <> '/' or length(p_path) > 200 then
    return;
  end if;
  insert into public.events (type, path) values (p_type, p_path);
end;
$$;

revoke all on function public.track_event(text, text) from public;
grant execute on function public.track_event(text, text) to anon, authenticated;

create or replace function public.analytics_summary(p_days integer default 30)
returns jsonb
language plpgsql
stable
set search_path = public
as $$
declare
  v_since timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)));
begin
  return jsonb_build_object(
    'page_views', (select count(*) from public.events where type = 'page_view' and created_at >= v_since),
    'whatsapp_clicks', (select count(*) from public.events where type = 'whatsapp_click' and created_at >= v_since),
    'add_to_cart', (select count(*) from public.events where type = 'add_to_cart' and created_at >= v_since),
    'orders_web', (select count(*) from public.orders where source = 'web' and status <> 'cancelado' and created_at >= v_since),
    'orders_manual', (select count(*) from public.orders where source = 'manual' and status <> 'cancelado' and created_at >= v_since),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'n', n))
      from (
        select path, count(*) as n from public.events
        where type = 'page_view' and created_at >= v_since
        group by path order by n desc limit 8
      ) t
    ), '[]'::jsonb),
    'top_products', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'n', n))
      from (
        select path, count(*) as n from public.events
        where type = 'page_view' and path like '/producto/%' and created_at >= v_since
        group by path order by n desc limit 5
      ) t
    ), '[]'::jsonb),
    'whatsapp_by_page', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'n', n))
      from (
        select path, count(*) as n from public.events
        where type = 'whatsapp_click' and created_at >= v_since
        group by path order by n desc limit 6
      ) t
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.analytics_summary(integer) from public, anon;
grant execute on function public.analytics_summary(integer) to authenticated;

-- =========================================================
-- place_order: ahora también valida stock y limita ráfagas
-- =========================================================

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

    select slug, name, price, stock_status into v_prod
    from public.products
    where slug = v_item ->> 'slug' and active = true;
    if not found then
      raise exception 'unknown_product';
    end if;
    if v_prod.stock_status = 'sin_stock' then
      raise exception 'out_of_stock';
    end if;

    v_subtotal := v_subtotal + v_prod.price * v_qty;
    v_items := v_items || jsonb_build_object('slug', v_prod.slug, 'name', v_prod.name, 'price', v_prod.price, 'qty', v_qty);
    v_summary := v_summary || (v_prod.name || ' ×' || v_qty);
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

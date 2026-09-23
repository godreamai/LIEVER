-- Pedidos reales y tarifas de envío editables.
--
-- shipping_zones: reemplaza la tabla fija de lib/adminData.ts. Una zona cubre un rango de
--   códigos postales; la zona marcada is_default aplica a cualquier CP que no caiga en otra.
-- orders: pedidos que llegan desde el carrito (vía place_order) o que carga el admin a mano.
-- place_order(): único punto de entrada público para crear un pedido. Recalcula precios y
--   envío en la base (no confía en los montos que manda el navegador).

-- =========================================================
-- Tarifas de envío
-- =========================================================

create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cp_from integer,
  cp_to integer,
  price numeric not null check (price >= 0),
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (is_default or (cp_from is not null and cp_to is not null and cp_from <= cp_to))
);

-- A lo sumo una zona por defecto.
create unique index if not exists shipping_zones_one_default on public.shipping_zones (is_default) where is_default;

alter table public.shipping_zones enable row level security;

create policy "shipping_zones_select_public"
  on public.shipping_zones for select
  to anon, authenticated
  using (true);

create policy "shipping_zones_insert_authenticated"
  on public.shipping_zones for insert
  to authenticated
  with check (true);

create policy "shipping_zones_update_authenticated"
  on public.shipping_zones for update
  to authenticated
  using (true)
  with check (true);

create policy "shipping_zones_delete_authenticated"
  on public.shipping_zones for delete
  to authenticated
  using (true);

insert into public.shipping_zones (name, cp_from, cp_to, price, is_default, sort_order) values
  ('Zona 1 — San Nicolás y alrededores', 2900, 2901, 4200, false, 1),
  ('Zona 2 — Rosario / Santa Fe sur',    2000, 2100, 5100, false, 2),
  ('Zona 3 — AMBA',                      1000, 1900, 5800, false, 3),
  ('Zona 4 — Resto del país',            null, null, 7400, true,  4);

-- =========================================================
-- Pedidos
-- =========================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity (start with 1001),
  customer text not null,
  phone text,
  zip text,
  items jsonb not null default '[]'::jsonb,
  summary text not null,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado')),
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Sin policies para anon: los visitantes no leen ni escriben pedidos directamente.
-- Solo el admin (authenticated) los ve y los gestiona.
create policy "orders_select_authenticated"
  on public.orders for select
  to authenticated
  using (true);

create policy "orders_insert_authenticated"
  on public.orders for insert
  to authenticated
  with check (true);

create policy "orders_update_authenticated"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- Alta de pedidos desde el carrito
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

  for v_item in select * from jsonb_array_elements(p_items) loop
    begin
      v_qty := (v_item ->> 'qty')::integer;
    exception when others then
      raise exception 'invalid_items';
    end;
    if v_qty is null or v_qty < 1 or v_qty > 99 then
      raise exception 'invalid_items';
    end if;

    select slug, name, price into v_prod
    from public.products
    where slug = v_item ->> 'slug' and active = true;
    if not found then
      raise exception 'unknown_product';
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

  insert into public.orders (customer, phone, zip, items, summary, subtotal, shipping, total)
  values (trim(p_customer), nullif(trim(coalesce(p_phone, '')), ''), p_zip, v_items, array_to_string(v_summary, ', '), v_subtotal, v_shipping, v_subtotal + v_shipping)
  returning orders.number into v_number;

  return query select v_number, v_subtotal, v_shipping, v_subtotal + v_shipping;
end;
$$;

revoke all on function public.place_order(text, text, text, jsonb) from public;
grant execute on function public.place_order(text, text, text, jsonb) to anon, authenticated;

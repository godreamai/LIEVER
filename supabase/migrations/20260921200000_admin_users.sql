-- Lista de administradores.
--
-- Hasta ahora las policies daban permisos de escritura a CUALQUIER usuario logueado
-- ("to authenticated"). Con el registro público de Supabase Auth abierto, eso permitía que
-- cualquiera se creara una cuenta y editara el catálogo o leyera los pedidos.
-- Desde acá, solo las cuentas listadas en admin_users pueden hacerlo.
--
-- Para dar acceso de administrador a una cuenta nueva (creada en Authentication → Users):
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'nueva-cuenta@ejemplo.com';

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Sin policies: nadie la lee ni la modifica desde la API. Se administra con SQL.
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Las cuentas que ya existen quedan como administradoras.
insert into public.admin_users (user_id)
select id from auth.users
on conflict do nothing;

-- =========================================================
-- Policies: de "cualquier usuario logueado" a "solo administradores"
-- =========================================================

-- categories (la lectura pública no cambia)
drop policy if exists "categories_insert_authenticated" on public.categories;
drop policy if exists "categories_update_authenticated" on public.categories;
drop policy if exists "categories_delete_authenticated" on public.categories;
create policy "categories_insert_admin" on public.categories for insert to authenticated with check (public.is_admin());
create policy "categories_update_admin" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "categories_delete_admin" on public.categories for delete to authenticated using (public.is_admin());

-- products: una cuenta logueada que no es admin ve lo mismo que un visitante (solo activos)
drop policy if exists "products_select_all_authenticated" on public.products;
drop policy if exists "products_insert_authenticated" on public.products;
drop policy if exists "products_update_authenticated" on public.products;
drop policy if exists "products_delete_authenticated" on public.products;
create policy "products_select_authenticated" on public.products for select to authenticated using (active = true or public.is_admin());
create policy "products_insert_admin" on public.products for insert to authenticated with check (public.is_admin());
create policy "products_update_admin" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products_delete_admin" on public.products for delete to authenticated using (public.is_admin());

-- shipping_zones (la lectura pública no cambia)
drop policy if exists "shipping_zones_insert_authenticated" on public.shipping_zones;
drop policy if exists "shipping_zones_update_authenticated" on public.shipping_zones;
drop policy if exists "shipping_zones_delete_authenticated" on public.shipping_zones;
create policy "shipping_zones_insert_admin" on public.shipping_zones for insert to authenticated with check (public.is_admin());
create policy "shipping_zones_update_admin" on public.shipping_zones for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "shipping_zones_delete_admin" on public.shipping_zones for delete to authenticated using (public.is_admin());

-- orders
drop policy if exists "orders_select_authenticated" on public.orders;
drop policy if exists "orders_insert_authenticated" on public.orders;
drop policy if exists "orders_update_authenticated" on public.orders;
create policy "orders_select_admin" on public.orders for select to authenticated using (public.is_admin());
create policy "orders_insert_admin" on public.orders for insert to authenticated with check (public.is_admin());
create policy "orders_update_admin" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- events
drop policy if exists "events_select_authenticated" on public.events;
create policy "events_select_admin" on public.events for select to authenticated using (public.is_admin());

-- Storage: solo un administrador sube, reemplaza o borra imágenes (la lectura sigue siendo pública)
drop policy if exists "product_images_insert_authenticated" on storage.objects;
drop policy if exists "product_images_update_authenticated" on storage.objects;
drop policy if exists "product_images_delete_authenticated" on storage.objects;
create policy "product_images_insert_admin" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "product_images_update_admin" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
create policy "product_images_delete_admin" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

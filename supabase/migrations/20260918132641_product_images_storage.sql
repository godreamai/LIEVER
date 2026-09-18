-- Bucket de Storage para las imágenes de producto subidas desde el admin.
-- Las imágenes ya existentes de /public siguen serviéndose como rutas locales;
-- este bucket es solo para las imágenes NUEVAS cargadas desde /admin/productos.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "product_images_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "product_images_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

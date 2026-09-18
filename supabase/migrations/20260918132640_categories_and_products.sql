-- Categorías y productos del catálogo LIEVER, migrados desde lib/data.ts (arrays estáticos)
-- hacia Supabase, para que el panel de administración pueda gestionarlos con persistencia real.

create extension if not exists pgcrypto;

-- =========================================================
-- Tablas
-- =========================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price numeric not null check (price > 0),
  measure text,
  category_id uuid references public.categories(id) on delete set null,
  image text,
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  medidas text[],
  colores text[],
  personalizable boolean not null default false,
  accesorios text[],
  tiempo_fabricacion text,
  envio boolean not null default true,
  retiro boolean not null default true,
  entrega_nota text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (active);

-- Mantiene products.updated_at al día en cada edición desde el admin.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;

-- categories: lectura pública total, escritura solo para admins logueados.
create policy "categories_select_public"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "categories_insert_authenticated"
  on public.categories for insert
  to authenticated
  with check (true);

create policy "categories_update_authenticated"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

create policy "categories_delete_authenticated"
  on public.categories for delete
  to authenticated
  using (true);

-- products: visitantes anónimos solo ven productos activos; el admin (authenticated) ve todo.
create policy "products_select_active_anon"
  on public.products for select
  to anon
  using (active = true);

create policy "products_select_all_authenticated"
  on public.products for select
  to authenticated
  using (true);

create policy "products_insert_authenticated"
  on public.products for insert
  to authenticated
  with check (true);

create policy "products_update_authenticated"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "products_delete_authenticated"
  on public.products for delete
  to authenticated
  using (true);

-- =========================================================
-- Seed: categorías reales (lib/data.ts CATEGORIES)
-- =========================================================

insert into public.categories (name, image, sort_order) values
  ('Paneles ranurados',   '/assets/photos/mdf-cut-panels.jpg', 1),
  ('Mobiliario comercial','/assets/photos/workshop-cnc.jpg',   2),
  ('Decoración',          '/assets/photos/mdf-cut-panels.jpg', 3),
  ('Cartelería',          '/assets/photos/mdf-cut-panels.jpg', 4),
  ('Muebles a medida',    '/assets/photos/tools-on-board.avif',5),
  ('Regalos',             '/assets/photos/workshop-cnc.jpg',   6)
on conflict (name) do nothing;

-- =========================================================
-- Seed: productos reales (lib/data.ts PANELES + MOBILIARIO + OTHER_PRODUCTS)
-- =========================================================

insert into public.products (
  slug, name, price, measure, category_id, image, description, specs,
  medidas, colores, personalizable, accesorios, tiempo_fabricacion,
  envio, retiro, entrega_nota, active
) values
  (
    'panel-ranurado-roble-120', 'Panel ranurado Roble 120', 32000, '120 × 60 cm',
    (select id from public.categories where name = 'Paneles ranurados'),
    '/assets/photos/mdf-cut-panels.jpg',
    'Panel ranurado horizontal para exhibir mercadería, organizar herramientas o vestir una pared comercial. Ranurado cada 3 cm, compatible con accesorios estándar.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Terminación","value":"Melamina o enchapado"},{"label":"Ranurado","value":"Cada 3 cm, paso europeo"},{"label":"Producción","value":"5 a 7 días hábiles"}]',
    array['60 × 60 cm','120 × 60 cm','120 × 90 cm'],
    array['Roble natural','Nogal','Blanco'],
    true,
    array['Ganchos simples y dobles','Repisas flotantes','Portamacetas'],
    '5 a 7 días hábiles', true, true, 'Envío a todo el país · retiro sin cargo en el taller', true
  ),
  (
    'panel-ranurado-blanco-90', 'Panel ranurado Blanco 90', 24500, '90 × 60 cm',
    (select id from public.categories where name = 'Paneles ranurados'),
    '/assets/photos/workshop-cnc.jpg',
    'Versión compacta pensada para vidrieras, probadores y espacios chicos que necesitan exhibir sin perder orden.',
    '[{"label":"Material","value":"MDF 15 mm"},{"label":"Terminación","value":"Melamina blanca"},{"label":"Ranurado","value":"Cada 3 cm, paso europeo"},{"label":"Producción","value":"4 a 6 días hábiles"}]',
    array['60 × 45 cm','90 × 60 cm'],
    array['Blanco','Gris claro'],
    true,
    array['Ganchos simples','Bandejas exhibidoras'],
    '4 a 6 días hábiles', true, true, 'Envío a todo el país · retiro sin cargo en el taller', true
  ),
  (
    'panel-ranurado-identidad', 'Panel ranurado con logo', 38900, '120 × 80 cm',
    (select id from public.categories where name = 'Paneles ranurados'),
    '/assets/photos/workshop-cnc.jpg',
    'El mismo sistema de ranurado, con tu logo o identidad grabada en el panel. Pensado para vidrieras y mostradores que quieren mostrar marca.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Terminación","value":"Melamina o enchapado + grabado CNC"},{"label":"Ranurado","value":"Cada 3 cm, paso europeo"},{"label":"Producción","value":"7 a 10 días hábiles"}]',
    array['90 × 60 cm','120 × 80 cm','medida especial'],
    array['Roble natural','Nogal','Negro','Blanco'],
    true,
    array['Ganchos simples y dobles','Repisas flotantes','Portamacetas','Bandejas exhibidoras'],
    '7 a 10 días hábiles', true, true, 'Envío a todo el país · retiro sin cargo en el taller', true
  ),
  (
    'panel-ranurado-modular-negro', 'Panel ranurado modular Negro', 29800, '80 × 80 cm',
    (select id from public.categories where name = 'Paneles ranurados'),
    '/assets/photos/tools-on-board.avif',
    'Formato cuadrado pensado para combinar varios módulos y armar una pared de exhibición a medida del local.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Terminación","value":"Melamina negra"},{"label":"Ranurado","value":"Cada 3 cm, paso europeo"},{"label":"Producción","value":"5 a 7 días hábiles"}]',
    array['80 × 80 cm'],
    array['Negro','Roble natural'],
    true,
    array['Ganchos simples y dobles','Repisas flotantes'],
    '5 a 7 días hábiles', true, true, 'Envío a todo el país · retiro sin cargo en el taller', true
  ),
  (
    'mostrador-modular-comercio', 'Mostrador modular', 145000, '120 × 90 × 45 cm',
    (select id from public.categories where name = 'Mobiliario comercial'),
    '/assets/photos/workshop-cnc.jpg',
    'Mostrador de atención al público con espacio de guardado interno. Estructura modular pensada para adaptarse al layout de tu local.',
    '[{"label":"Material","value":"MDF 18 mm + estructura reforzada"},{"label":"Terminación","value":"Melamina o enchapado"},{"label":"Carga superior","value":"Hasta 25 kg"},{"label":"Producción","value":"10 a 15 días hábiles"}]',
    array['100 × 90 × 45 cm','120 × 90 × 45 cm','medida especial'],
    array['Roble natural','Nogal','Blanco','Negro'],
    true,
    array['Cajonera interna','Pasacables','Iluminación LED'],
    '10 a 15 días hábiles', true, true, 'Envío a todo el país (a coordinar por volumen) · retiro en taller', true
  ),
  (
    'estanteria-modular-pared', 'Estantería modular de pared', 68000, '100 × 180 cm',
    (select id from public.categories where name = 'Mobiliario comercial'),
    '/assets/photos/mdf-cut-panels.jpg',
    'Sistema de estantes para aprovechar altura de pared, exhibir mercadería y organizar stock a la vista del cliente.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Terminación","value":"Melamina o enchapado"},{"label":"Carga por estante","value":"Hasta 15 kg"},{"label":"Producción","value":"8 a 12 días hábiles"}]',
    array['100 × 120 cm','100 × 180 cm','medida especial'],
    array['Roble natural','Nogal','Blanco'],
    true,
    array['Estantes intermedios','Iluminación LED','Ganchos exhibidores'],
    '8 a 12 días hábiles', true, true, 'Envío a todo el país · retiro en taller', true
  ),
  (
    'exhibidor-piso-comercial', 'Exhibidor de piso', 52000, '50 × 50 × 140 cm',
    (select id from public.categories where name = 'Mobiliario comercial'),
    '/assets/photos/tools-on-board.avif',
    'Exhibidor independiente para ubicar en isla o vidriera. Ideal para destacar una línea de producto o una promoción puntual.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Terminación","value":"Melamina o enchapado"},{"label":"Carga superior","value":"Hasta 10 kg"},{"label":"Producción","value":"7 a 10 días hábiles"}]',
    array['40 × 40 × 120 cm','50 × 50 × 140 cm'],
    array['Roble natural','Blanco','Negro'],
    true,
    array['Cartelería superior','Base con ruedas'],
    '7 a 10 días hábiles', true, true, 'Envío a todo el país · retiro en taller', true
  ),
  (
    'divisor-ambientes-modular', 'Divisor de ambientes modular', 89000, '160 × 180 cm',
    (select id from public.categories where name = 'Mobiliario comercial'),
    '/assets/photos/mdf-cut-panels.jpg',
    'Panel calado autoportante para separar sectores de un local o una oficina sin recurrir a obra. Se arma y desarma sin herramientas especiales.',
    '[{"label":"Material","value":"MDF calado 18 mm"},{"label":"Terminación","value":"Melamina o enchapado"},{"label":"Armado","value":"Sin herramientas, por encastre"},{"label":"Producción","value":"8 a 12 días hábiles"}]',
    array['120 × 180 cm','160 × 180 cm','medida especial'],
    array['Roble natural','Nogal','Blanco'],
    true,
    array['Base autoportante','Ruedas para traslado'],
    '8 a 12 días hábiles', true, true, 'Envío a todo el país (a coordinar por volumen) · retiro en taller', true
  ),
  (
    'portarretratos-roble', 'Portarretratos roble', 14500, '30 × 18 cm',
    (select id from public.categories where name = 'Decoración'),
    '/assets/photos/workshop-cnc.jpg',
    'Cortado en MDF de 18 mm con precisión CNC, terminación al natural con aceite. Ideal para foto 15 × 20.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Medidas","value":"30 × 18 cm"},{"label":"Terminación","value":"Aceite natural"},{"label":"Producción","value":"3 a 5 días"}]',
    null, null, false, null, null, true, true, null, true
  ),
  (
    'cartel-nombre', 'Cartel nombre a medida', 9800, '40 × 12 cm',
    (select id from public.categories where name = 'Cartelería'),
    '/assets/photos/mdf-cut-panels.jpg',
    'Nombre o frase cortada en una sola pieza. Elegís tipografía y largo; nosotros ajustamos el trazo para que el corte no pierda detalle.',
    '[{"label":"Material","value":"MDF 12 mm"},{"label":"Medidas","value":"hasta 40 × 12 cm"},{"label":"Terminación","value":"Crudo o pintado"},{"label":"Producción","value":"2 a 4 días"}]',
    null, null, false, null, null, true, true, null, true
  ),
  (
    'repisa-flotante', 'Repisa flotante 60 cm', 21300, '60 × 12 cm',
    (select id from public.categories where name = 'Muebles a medida'),
    '/assets/photos/tools-on-board.avif',
    'Repisa con soporte oculto, cortada y calibrada para que quede al ras de la pared.',
    '[{"label":"Material","value":"MDF 18 mm"},{"label":"Medidas","value":"60 × 12 × 3 cm"},{"label":"Carga","value":"hasta 8 kg"},{"label":"Producción","value":"4 a 6 días"}]',
    null, null, false, null, null, true, true, null, true
  ),
  (
    'posavasos-geometrico', 'Set posavasos geométrico', 7200, '10 × 10 cm',
    (select id from public.categories where name = 'Regalos'),
    '/assets/photos/mdf-cut-panels.jpg',
    'Cuatro posavasos con grabado geométrico, cada uno con un patrón distinto.',
    '[{"label":"Material","value":"MDF 9 mm"},{"label":"Medidas","value":"10 × 10 cm (×4)"},{"label":"Terminación","value":"Grabado + aceite"},{"label":"Producción","value":"2 días"}]',
    null, null, false, null, null, true, true, null, true
  ),
  (
    'organizador-escritorio', 'Organizador escritorio', 16900, '28 × 14 cm',
    (select id from public.categories where name = 'Decoración'),
    '/assets/photos/workshop-cnc.jpg',
    'Tres compartimentos y una bandeja baja, encastrado sin tornillos.',
    '[{"label":"Material","value":"MDF 12 mm"},{"label":"Medidas","value":"28 × 14 × 10 cm"},{"label":"Terminación","value":"Crudo"},{"label":"Producción","value":"3 días"}]',
    null, null, false, null, null, true, true, null, true
  ),
  (
    'cuadro-geometrico', 'Cuadro geométrico 40 cm', 12400, '40 × 40 cm',
    (select id from public.categories where name = 'Decoración'),
    '/assets/photos/mdf-cut-panels.jpg',
    'Panel de listones cortados en ángulo, montado sobre base de MDF.',
    '[{"label":"Material","value":"MDF + listones"},{"label":"Medidas","value":"40 × 40 cm"},{"label":"Terminación","value":"Aceite natural"},{"label":"Producción","value":"5 días"}]',
    null, null, false, null, null, true, true, null, true
  )
on conflict (slug) do nothing;

-- Seleccionables por producto (ej: Medida, Color) y matriz de precios por combinación.
--   options:  [{ "name": "Medida", "values": ["150x70", "180x80"], "affectsPrice": true }]
--   variants: [{ "combo": { "Medida": "150x70", "Color": "Roble" }, "price": 185000 }]
-- Una combinación sin fila en `variants` usa el precio base del producto.

alter table public.products
  add column if not exists options jsonb not null default '[]'::jsonb,
  add column if not exists variants jsonb not null default '[]'::jsonb;

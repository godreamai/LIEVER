-- Pasa products.medidas / products.colores a seleccionables (products.options), sin precios propios:
-- todas las combinaciones se cobran al precio base hasta que se cargue la matriz desde el admin.
-- Solo toca productos que todavía no tienen seleccionables. Las columnas viejas se conservan pero la app ya no las lee.

update public.products p
set options = (
  select coalesce(jsonb_agg(s.opt order by s.ord), '[]'::jsonb)
  from (
    select 1 as ord, jsonb_build_object('name', 'Medida', 'values', to_jsonb(p.medidas), 'affectsPrice', true) as opt
    where p.medidas is not null and cardinality(p.medidas) > 0
    union all
    select 2, jsonb_build_object('name', 'Color', 'values', to_jsonb(p.colores), 'affectsPrice', true)
    where p.colores is not null and cardinality(p.colores) > 0
  ) s
)
where p.options = '[]'::jsonb
  and (cardinality(p.medidas) > 0 or cardinality(p.colores) > 0);

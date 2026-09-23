# LIEVER

Sitio y tienda de LIEVER: mobiliario comercial, paneles ranurados y piezas a medida (San Nicolás de los Arroyos).
Next.js (App Router) + Supabase. El catálogo, los pedidos y las tarifas de envío se administran desde `/admin`.

> Esta versión de Next.js tiene diferencias con la que suele documentarse. Ante cualquier duda de API, leer la guía en `node_modules/next/dist/docs/` (ver [AGENTS.md](AGENTS.md)).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # o crear .env.local a mano con las variables de abajo
npm run dev                  # http://localhost:3000
```

### Variables de entorno

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (`anon`) de Supabase |
| `NEXT_PUBLIC_SITE_URL` | Dominio público, sin barra final (`https://tudominio.com`). Lo usan el sitemap, `robots.txt` y las imágenes al compartir enlaces. Sin ella salen direcciones de `localhost`. |

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Compilación y servidor de producción |
| `npm run lint` | ESLint |

## Base de datos (Supabase)

El esquema vive en [supabase/migrations](supabase/migrations) y se aplica con la CLI de Supabase, con el proyecto vinculado (`npx supabase link`):

```bash
npx supabase db push --dry-run   # ver qué se aplicaría
npx supabase db push             # aplicar
```

Tablas principales: `categories`, `products`, `orders`, `shipping_zones`, `events`. Los visitantes solo pueden leer productos activos, categorías y zonas de envío; crear pedidos (`place_order`) y registrar eventos (`track_event`) pasan por funciones que validan y recalculan todo en la base. Todo lo demás requiere una cuenta admin.

## Estructura

```
app/(site)/     Sitio público (home, productos, soluciones, nosotros, contacto, carrito…)
app/admin/      Panel de administración (protegido por proxy.ts)
app/api/track/  Registro anónimo de visitas y clics
components/     Componentes de interfaz (components/ds) y del admin
lib/            Acceso a datos (products, orders, shipping), tipos y utilidades
supabase/       Migraciones SQL
```

- **Categorías como filtros:** no hay páginas por categoría; se usa `/productos?categoria=<slug>` (el slug sale del nombre de la categoría).
- **Caché:** las lecturas públicas (productos, categorías, tarifas) se cachean 5 minutos y el admin las invalida al guardar cambios.

## Administración

Se entra en `/admin` con una cuenta de Supabase Auth. Las cuentas se crean desde el panel de Supabase (Authentication → Users).

**Permisos:** tener una cuenta no alcanza; tiene que estar en la tabla `admin_users`. Para dar acceso a una cuenta nueva, en el SQL Editor de Supabase:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'nueva-cuenta@ejemplo.com';
```

Para quitar el acceso: `delete from public.admin_users where user_id = (select id from auth.users where email = '...');`. Además, conviene mantener **desactivado el registro público** (Authentication → Sign In / Providers → *Allow new users to sign up*).

- **Productos:** crear, editar, activar/desactivar y eliminar. Cada producto tiene disponibilidad: *Disponible*, *A pedido* o *Sin stock* (los sin stock se ven pero no se pueden comprar).
- **Categorías:** crear, renombrar, reordenar y eliminar. Cambiar el nombre cambia el link del filtro. No se puede eliminar una categoría con productos.
- **Pedidos:** llegan del carrito con un número (#1001, #1002…). Avanzar el estado abre WhatsApp con el aviso listo para el cliente. También se pueden cargar pedidos a mano.
- **Tarifas de envío:** zonas por rango de código postal, más una zona “resto del país”. El carrito calcula el envío con esta tabla.
- **Estadísticas:** visitas, clics en WhatsApp, altas al carrito y pedidos por origen (sin cookies ni datos personales). No se registra nada desde `localhost` ni desde el admin.

## Pendientes conocidos

- **Proyectos:** la página `/proyectos` tiene ejemplos de muestra; está fuera del menú y del buscador hasta cargar trabajos reales (`lib/projects.ts`).
- **Fotos:** varias secciones reutilizan las mismas fotos del taller (`lib/data.ts`, `PHOTOS`).

export const SITE_NAME = "LIEVER";

export const SITE_DESCRIPTION =
  "Diseñamos y fabricamos mobiliario comercial, paneles ranurados y piezas a medida en San Nicolás de los Arroyos. Envíos a todo el país.";

// Dominio público del sitio (sin barra final). Definilo como NEXT_PUBLIC_SITE_URL en el hosting;
// se usa para el sitemap, robots.txt y las imágenes al compartir enlaces.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

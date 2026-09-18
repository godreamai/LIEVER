export const WA = "https://wa.me/5493364027991?text=";
export const PHONE = "+54 9 336 402-7991";
export const PHONE_RAW = "+5493364027991";
export const INSTAGRAM = "https://www.instagram.com/liever.sannicolas/";
export const INSTAGRAM_EVENTOS = "https://www.instagram.com/lievereventos";
export const ADDRESS = "Garibaldi 203, San Nicolás de los Arroyos, Bs. As.";
export const MAPS_URL = "https://maps.app.goo.gl/3rZgchRJQVuHyoZb8";
export const HOURS_WEEKDAY = "Lun – Vie  9:00 a 20:00";
export const HOURS_SAT = "Sábados  9:00 a 13:00";

export const PHOTOS = {
  panels: "/assets/photos/mdf-cut-panels.jpg",
  // router y wallart todavia no tienen foto real del cliente:
  // se repiten fotos del taller hasta que el cliente mande las propias.
  router: "/assets/photos/workshop-cnc.jpg",
  wallart: "/assets/photos/mdf-cut-panels.jpg",
  workshop: "/assets/photos/workshop-cnc.jpg",
  tools: "/assets/photos/tools-on-board.avif",
};

export const HERO_VIDEO = "/uploads/hero-cnc.mp4";

// Los productos y categorías vivían acá como arrays estáticos. Ahora son
// datos reales en Supabase (tablas `products` / `categories`, ver lib/products.ts)
// para que el admin pueda crear, editar, activar/desactivar y eliminar productos.

export const money = (n: number) => "$" + n.toLocaleString("es-AR");

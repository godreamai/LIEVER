import type { Category, Product } from "./types";

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

export const PANELES: Product[] = [
  {
    slug: "panel-ranurado-roble-120",
    name: "Panel ranurado Roble 120",
    price: 32000,
    measure: "120 × 60 cm",
    category: "Paneles ranurados",
    image: PHOTOS.panels,
    desc: "Panel ranurado horizontal para exhibir mercadería, organizar herramientas o vestir una pared comercial. Ranurado cada 3 cm, compatible con accesorios estándar.",
    medidas: ["60 × 60 cm", "120 × 60 cm", "120 × 90 cm"],
    colores: ["Roble natural", "Nogal", "Blanco"],
    personalizable: true,
    accesorios: ["Ganchos simples y dobles", "Repisas flotantes", "Portamacetas"],
    tiempoFabricacion: "5 a 7 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país · retiro sin cargo en el taller" },
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Terminación", value: "Melamina o enchapado" },
      { label: "Ranurado", value: "Cada 3 cm, paso europeo" },
      { label: "Producción", value: "5 a 7 días hábiles" },
    ],
  },
  {
    slug: "panel-ranurado-blanco-90",
    name: "Panel ranurado Blanco 90",
    price: 24500,
    measure: "90 × 60 cm",
    category: "Paneles ranurados",
    image: PHOTOS.router,
    desc: "Versión compacta pensada para vidrieras, probadores y espacios chicos que necesitan exhibir sin perder orden.",
    medidas: ["60 × 45 cm", "90 × 60 cm"],
    colores: ["Blanco", "Gris claro"],
    personalizable: true,
    accesorios: ["Ganchos simples", "Bandejas exhibidoras"],
    tiempoFabricacion: "4 a 6 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país · retiro sin cargo en el taller" },
    specs: [
      { label: "Material", value: "MDF 15 mm" },
      { label: "Terminación", value: "Melamina blanca" },
      { label: "Ranurado", value: "Cada 3 cm, paso europeo" },
      { label: "Producción", value: "4 a 6 días hábiles" },
    ],
  },
  {
    slug: "panel-ranurado-identidad",
    name: "Panel ranurado con logo",
    price: 38900,
    measure: "120 × 80 cm",
    category: "Paneles ranurados",
    image: PHOTOS.workshop,
    desc: "El mismo sistema de ranurado, con tu logo o identidad grabada en el panel. Pensado para vidrieras y mostradores que quieren mostrar marca.",
    medidas: ["90 × 60 cm", "120 × 80 cm", "medida especial"],
    colores: ["Roble natural", "Nogal", "Negro", "Blanco"],
    personalizable: true,
    accesorios: ["Ganchos simples y dobles", "Repisas flotantes", "Portamacetas", "Bandejas exhibidoras"],
    tiempoFabricacion: "7 a 10 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país · retiro sin cargo en el taller" },
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Terminación", value: "Melamina o enchapado + grabado CNC" },
      { label: "Ranurado", value: "Cada 3 cm, paso europeo" },
      { label: "Producción", value: "7 a 10 días hábiles" },
    ],
  },
  {
    slug: "panel-ranurado-modular-negro",
    name: "Panel ranurado modular Negro",
    price: 29800,
    measure: "80 × 80 cm",
    category: "Paneles ranurados",
    image: PHOTOS.tools,
    desc: "Formato cuadrado pensado para combinar varios módulos y armar una pared de exhibición a medida del local.",
    medidas: ["80 × 80 cm"],
    colores: ["Negro", "Roble natural"],
    personalizable: true,
    accesorios: ["Ganchos simples y dobles", "Repisas flotantes"],
    tiempoFabricacion: "5 a 7 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país · retiro sin cargo en el taller" },
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Terminación", value: "Melamina negra" },
      { label: "Ranurado", value: "Cada 3 cm, paso europeo" },
      { label: "Producción", value: "5 a 7 días hábiles" },
    ],
  },
];

export const MOBILIARIO: Product[] = [
  {
    slug: "mostrador-modular-comercio",
    name: "Mostrador modular",
    price: 145000,
    measure: "120 × 90 × 45 cm",
    category: "Mobiliario comercial",
    image: PHOTOS.workshop,
    desc: "Mostrador de atención al público con espacio de guardado interno. Estructura modular pensada para adaptarse al layout de tu local.",
    medidas: ["100 × 90 × 45 cm", "120 × 90 × 45 cm", "medida especial"],
    colores: ["Roble natural", "Nogal", "Blanco", "Negro"],
    personalizable: true,
    accesorios: ["Cajonera interna", "Pasacables", "Iluminación LED"],
    tiempoFabricacion: "10 a 15 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país (a coordinar por volumen) · retiro en taller" },
    specs: [
      { label: "Material", value: "MDF 18 mm + estructura reforzada" },
      { label: "Terminación", value: "Melamina o enchapado" },
      { label: "Carga superior", value: "Hasta 25 kg" },
      { label: "Producción", value: "10 a 15 días hábiles" },
    ],
  },
  {
    slug: "estanteria-modular-pared",
    name: "Estantería modular de pared",
    price: 68000,
    measure: "100 × 180 cm",
    category: "Mobiliario comercial",
    image: PHOTOS.panels,
    desc: "Sistema de estantes para aprovechar altura de pared, exhibir mercadería y organizar stock a la vista del cliente.",
    medidas: ["100 × 120 cm", "100 × 180 cm", "medida especial"],
    colores: ["Roble natural", "Nogal", "Blanco"],
    personalizable: true,
    accesorios: ["Estantes intermedios", "Iluminación LED", "Ganchos exhibidores"],
    tiempoFabricacion: "8 a 12 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país · retiro en taller" },
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Terminación", value: "Melamina o enchapado" },
      { label: "Carga por estante", value: "Hasta 15 kg" },
      { label: "Producción", value: "8 a 12 días hábiles" },
    ],
  },
  {
    slug: "exhibidor-piso-comercial",
    name: "Exhibidor de piso",
    price: 52000,
    measure: "50 × 50 × 140 cm",
    category: "Mobiliario comercial",
    image: PHOTOS.tools,
    desc: "Exhibidor independiente para ubicar en isla o vidriera. Ideal para destacar una línea de producto o una promoción puntual.",
    medidas: ["40 × 40 × 120 cm", "50 × 50 × 140 cm"],
    colores: ["Roble natural", "Blanco", "Negro"],
    personalizable: true,
    accesorios: ["Cartelería superior", "Base con ruedas"],
    tiempoFabricacion: "7 a 10 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país · retiro en taller" },
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Terminación", value: "Melamina o enchapado" },
      { label: "Carga superior", value: "Hasta 10 kg" },
      { label: "Producción", value: "7 a 10 días hábiles" },
    ],
  },
  {
    slug: "divisor-ambientes-modular",
    name: "Divisor de ambientes modular",
    price: 89000,
    measure: "160 × 180 cm",
    category: "Mobiliario comercial",
    image: PHOTOS.wallart,
    desc: "Panel calado autoportante para separar sectores de un local o una oficina sin recurrir a obra. Se arma y desarma sin herramientas especiales.",
    medidas: ["120 × 180 cm", "160 × 180 cm", "medida especial"],
    colores: ["Roble natural", "Nogal", "Blanco"],
    personalizable: true,
    accesorios: ["Base autoportante", "Ruedas para traslado"],
    tiempoFabricacion: "8 a 12 días hábiles",
    entrega: { envio: true, retiro: true, nota: "Envío a todo el país (a coordinar por volumen) · retiro en taller" },
    specs: [
      { label: "Material", value: "MDF calado 18 mm" },
      { label: "Terminación", value: "Melamina o enchapado" },
      { label: "Armado", value: "Sin herramientas, por encastre" },
      { label: "Producción", value: "8 a 12 días hábiles" },
    ],
  },
];

const OTHER_PRODUCTS: Product[] = [
  {
    slug: "portarretratos-roble",
    name: "Portarretratos roble",
    price: 14500,
    measure: "30 × 18 cm",
    category: "Decoración",
    image: PHOTOS.router,
    desc: "Cortado en MDF de 18 mm con precisión CNC, terminación al natural con aceite. Ideal para foto 15 × 20.",
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Medidas", value: "30 × 18 cm" },
      { label: "Terminación", value: "Aceite natural" },
      { label: "Producción", value: "3 a 5 días" },
    ],
  },
  {
    slug: "cartel-nombre",
    name: "Cartel nombre a medida",
    price: 9800,
    measure: "40 × 12 cm",
    category: "Cartelería",
    image: PHOTOS.panels,
    desc: "Nombre o frase cortada en una sola pieza. Elegís tipografía y largo; nosotros ajustamos el trazo para que el corte no pierda detalle.",
    specs: [
      { label: "Material", value: "MDF 12 mm" },
      { label: "Medidas", value: "hasta 40 × 12 cm" },
      { label: "Terminación", value: "Crudo o pintado" },
      { label: "Producción", value: "2 a 4 días" },
    ],
  },
  {
    slug: "repisa-flotante",
    name: "Repisa flotante 60 cm",
    price: 21300,
    measure: "60 × 12 cm",
    category: "Muebles a medida",
    image: PHOTOS.tools,
    desc: "Repisa con soporte oculto, cortada y calibrada para que quede al ras de la pared.",
    specs: [
      { label: "Material", value: "MDF 18 mm" },
      { label: "Medidas", value: "60 × 12 × 3 cm" },
      { label: "Carga", value: "hasta 8 kg" },
      { label: "Producción", value: "4 a 6 días" },
    ],
  },
  {
    slug: "posavasos-geometrico",
    name: "Set posavasos geométrico",
    price: 7200,
    measure: "10 × 10 cm",
    category: "Regalos",
    image: PHOTOS.wallart,
    desc: "Cuatro posavasos con grabado geométrico, cada uno con un patrón distinto.",
    specs: [
      { label: "Material", value: "MDF 9 mm" },
      { label: "Medidas", value: "10 × 10 cm (×4)" },
      { label: "Terminación", value: "Grabado + aceite" },
      { label: "Producción", value: "2 días" },
    ],
  },
  {
    slug: "organizador-escritorio",
    name: "Organizador escritorio",
    price: 16900,
    measure: "28 × 14 cm",
    category: "Decoración",
    image: PHOTOS.workshop,
    desc: "Tres compartimentos y una bandeja baja, encastrado sin tornillos.",
    specs: [
      { label: "Material", value: "MDF 12 mm" },
      { label: "Medidas", value: "28 × 14 × 10 cm" },
      { label: "Terminación", value: "Crudo" },
      { label: "Producción", value: "3 días" },
    ],
  },
  {
    slug: "cuadro-geometrico",
    name: "Cuadro geométrico 40 cm",
    price: 12400,
    measure: "40 × 40 cm",
    category: "Decoración",
    image: PHOTOS.wallart,
    desc: "Panel de listones cortados en ángulo, montado sobre base de MDF.",
    specs: [
      { label: "Material", value: "MDF + listones" },
      { label: "Medidas", value: "40 × 40 cm" },
      { label: "Terminación", value: "Aceite natural" },
      { label: "Producción", value: "5 días" },
    ],
  },
];

export const PRODUCTS: Product[] = [...PANELES, ...MOBILIARIO, ...OTHER_PRODUCTS];

function countByCategory(category: string) {
  return PRODUCTS.filter((p) => p.category === category).length;
}

export const CATEGORIES: Category[] = [
  { index: "01", name: "Paneles ranurados", image: PHOTOS.panels, count: countByCategory("Paneles ranurados") },
  { index: "02", name: "Mobiliario comercial", image: PHOTOS.workshop, count: countByCategory("Mobiliario comercial") },
  { index: "03", name: "Decoración", image: PHOTOS.wallart, count: countByCategory("Decoración") },
  { index: "04", name: "Cartelería", image: PHOTOS.panels, count: countByCategory("Cartelería") },
  { index: "05", name: "Muebles a medida", image: PHOTOS.tools, count: countByCategory("Muebles a medida") },
  { index: "06", name: "Regalos", image: PHOTOS.workshop, count: countByCategory("Regalos") },
];

export const money = (n: number) => "$" + n.toLocaleString("es-AR");

import type { Category, Product } from "./types";

export const WA = "https://wa.me/5493364000000?text=";

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

export const PRODUCTS: Product[] = [
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

export const CATEGORIES: Category[] = [
  { index: "01", name: "Decoración", icon: "star", count: 14 },
  { index: "02", name: "Cartelería", icon: "ruler", count: 9 },
  { index: "03", name: "Muebles a medida", icon: "hammer", count: 6 },
  { index: "04", name: "Regalos", icon: "package", count: 11 },
];

export const money = (n: number) => "$" + n.toLocaleString("es-AR");

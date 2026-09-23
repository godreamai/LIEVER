import { PHOTOS } from "./data";

export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  desc: string;
}

// Portfolio placeholder: reemplazar por fotos y descripciones reales
// a medida que se documenten los primeros proyectos de comercios.
export const PROJECTS: Project[] = [
  {
    slug: "vidriera-panel-ranurado",
    title: "Vidriera con panel ranurado a medida",
    category: "Comercios",
    image: PHOTOS.panels,
    desc: "Pared de exhibición modular para una tienda de indumentaria, con ganchos y repisas intercambiables según la temporada.",
  },
  {
    slug: "mostrador-cafeteria",
    title: "Mostrador para cafetería",
    category: "Mobiliario comercial",
    image: PHOTOS.workshop,
    desc: "Mostrador de atención con guardado interno y espacio para exhibidor de productos, diseñado a partir del plano del local.",
  },
  {
    slug: "divisor-oficina",
    title: "Divisor de ambientes para oficina",
    category: "Profesionales",
    image: PHOTOS.wallart,
    desc: "Proyecto en conjunto con un estudio de arquitectura para separar sectores de trabajo sin intervenir la obra existente.",
  },
  {
    slug: "estanteria-showroom",
    title: "Estantería modular para showroom",
    category: "Comercios",
    image: PHOTOS.router,
    desc: "Sistema de estantes a medida de la altura del local, pensado para rotar la exhibición de producto.",
  },
  {
    slug: "identidad-panel-logo",
    title: "Panel ranurado con identidad de marca",
    category: "Personalización",
    image: PHOTOS.tools,
    desc: "Panel grabado con el logo del comercio, combinando exhibición funcional y presencia de marca en el punto de venta.",
  },
];

export interface Solution {
  slug: string;
  title: string;
  description: string;
  icon: string;
  /** Acción principal (pedir presupuesto / contacto). */
  cta: { label: string; href: string };
  /** Acceso directo al catálogo, si hay productos para esa necesidad. */
  catalog?: { label: string; href: string };
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "abrir-comercio",
    title: "Estoy abriendo un comercio",
    description: "Te ayudamos a equipar tu espacio desde cero: mobiliario, paneles, exhibidores y cartelería pensados para tu apertura.",
    icon: "package",
    cta: { label: "Quiero equipar mi comercio", href: "/contacto?motivo=abrir-comercio" },
    catalog: { label: "Ver mobiliario", href: "/productos?categoria=mobiliario-comercial" },
  },
  {
    slug: "renovar-comercio",
    title: "Quiero renovar mi comercio",
    description: "Nuevas configuraciones, mobiliario y soluciones personalizadas para actualizar tu espacio sin empezar de cero.",
    icon: "hammer",
    cta: { label: "Cotizar proyecto", href: "/contacto?motivo=renovar-comercio" },
    catalog: { label: "Ver productos", href: "/productos?categoria=todos" },
  },
  {
    slug: "dividir-ambiente",
    title: "Necesito dividir un ambiente",
    description: "Divisores y soluciones funcionales para reorganizar un espacio sin recurrir, en muchos casos, a intervenciones de obra.",
    icon: "layout-dashboard",
    cta: { label: "Consultar por divisores", href: "/contacto?motivo=dividir-ambiente" },
    catalog: { label: "Ver mobiliario", href: "/productos?categoria=mobiliario-comercial" },
  },
  {
    slug: "panel-ranurado",
    title: "Quiero un panel ranurado",
    description: "Elegí modelo, medida, color y opciones de personalización para organizar, exhibir y darle identidad a tu espacio.",
    icon: "layers",
    cta: { label: "Pedir a medida", href: "/contacto?motivo=panel-ranurado" },
    catalog: { label: "Ver paneles ranurados", href: "/productos?categoria=paneles-ranurados" },
  },
  {
    slug: "profesionales",
    title: "Soy arquitecto / profesional",
    description: "Incorporá soluciones LIEVER a tus proyectos: divisores, mobiliario, paneles y piezas especiales a partir de las necesidades de cada espacio.",
    icon: "pencil",
    cta: { label: "Trabajemos juntos", href: "/contacto?motivo=profesionales" },
  },
  {
    slug: "no-encuentro",
    title: "Necesito algo que no encuentro",
    description: "Contanos qué necesitás y desarrollamos una solución a medida para tu proyecto.",
    icon: "message-circle",
    cta: { label: "Pedir algo a medida", href: "/personalizado" },
  },
];

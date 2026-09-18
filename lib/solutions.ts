export interface Solution {
  slug: string;
  title: string;
  description: string;
  icon: string;
  cta: { label: string; href: string };
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "abrir-comercio",
    title: "Estoy abriendo un comercio",
    description: "Te ayudamos a equipar tu espacio desde cero: mobiliario, paneles, exhibidores y cartelería pensados para tu apertura.",
    icon: "package",
    cta: { label: "Quiero equipar mi comercio", href: "/contacto?motivo=abrir-comercio" },
  },
  {
    slug: "renovar-comercio",
    title: "Quiero renovar mi comercio",
    description: "Nuevas configuraciones, mobiliario y soluciones personalizadas para actualizar tu espacio sin empezar de cero.",
    icon: "hammer",
    cta: { label: "Cotizar proyecto", href: "/contacto?motivo=renovar-comercio" },
  },
  {
    slug: "dividir-ambiente",
    title: "Necesito dividir un ambiente",
    description: "Divisores y soluciones funcionales para reorganizar un espacio sin recurrir, en muchos casos, a intervenciones de obra.",
    icon: "layout-dashboard",
    cta: { label: "Ver mobiliario", href: "/mobiliario" },
  },
  {
    slug: "panel-ranurado",
    title: "Quiero un panel ranurado",
    description: "Elegí modelo, medida, color y opciones de personalización para organizar, exhibir y darle identidad a tu espacio.",
    icon: "layers",
    cta: { label: "Ver paneles ranurados", href: "/paneles-ranurados" },
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
    cta: { label: "Cotizar proyecto", href: "/contacto?motivo=no-encuentro" },
  },
];

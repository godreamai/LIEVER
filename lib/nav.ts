export interface NavLink {
  id: string;
  href: string;
  label: string;
  footerOnly?: boolean;
  extraMatch?: string[];
  /** Agrupación usada solo en el footer, para no listar los 7 links en una sola columna. */
  group?: "explora" | "marca";
}

export const NAV_LINKS: NavLink[] = [
  { id: "productos", href: "/catalogo", label: "Productos", extraMatch: ["/producto"], group: "explora" },
  { id: "paneles", href: "/paneles-ranurados", label: "Paneles Ranurados", group: "explora" },
  { id: "mobiliario", href: "/mobiliario", label: "Mobiliario", footerOnly: true, group: "explora" },
  { id: "soluciones", href: "/soluciones", label: "Soluciones", group: "explora" },
  { id: "proyectos", href: "/proyectos", label: "Proyectos", group: "marca" },
  { id: "nosotros", href: "/nosotros", label: "Nosotros", group: "marca" },
  { id: "contacto", href: "/contacto", label: "Contacto", group: "marca" },
];

export const HEADER_NAV_LINKS = NAV_LINKS.filter((l) => !l.footerOnly);

export function isNavActive(pathname: string | null, link: NavLink): boolean {
  if (!pathname) return false;
  if (link.href === "/") return pathname === "/";
  if (pathname === link.href || pathname.startsWith(link.href + "/")) return true;
  return (link.extraMatch || []).some((m) => pathname === m || pathname.startsWith(m + "/"));
}

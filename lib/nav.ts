export interface NavLink {
  id: string;
  href: string;
  label: string;
  footerOnly?: boolean;
  extraMatch?: string[];
}

export const NAV_LINKS: NavLink[] = [
  { id: "inicio", href: "/", label: "Inicio", footerOnly: true },
  { id: "productos", href: "/catalogo", label: "Productos", extraMatch: ["/producto"] },
  { id: "paneles", href: "/paneles-ranurados", label: "Paneles Ranurados" },
  { id: "mobiliario", href: "/mobiliario", label: "Mobiliario", footerOnly: true },
  { id: "soluciones", href: "/soluciones", label: "Soluciones" },
  { id: "proyectos", href: "/proyectos", label: "Proyectos" },
  { id: "nosotros", href: "/nosotros", label: "Nosotros" },
  { id: "contacto", href: "/contacto", label: "Contacto" },
];

export const HEADER_NAV_LINKS = NAV_LINKS.filter((l) => !l.footerOnly);

export function isNavActive(pathname: string | null, link: NavLink): boolean {
  if (!pathname) return false;
  if (link.href === "/") return pathname === "/";
  if (pathname === link.href || pathname.startsWith(link.href + "/")) return true;
  return (link.extraMatch || []).some((m) => pathname === m || pathname.startsWith(m + "/"));
}

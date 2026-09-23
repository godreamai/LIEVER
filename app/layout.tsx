import type { Metadata } from "next";
import { Zilla_Slab, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "LIEVER — Mobiliario, paneles ranurados y diseño a medida", template: "%s | LIEVER" },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, locale: "es_AR", type: "website", images: [{ url: "/logo.png" }] },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${zillaSlab.variable} ${inter.variable} ${plexMono.variable}`}>
      <body suppressHydrationWarning>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

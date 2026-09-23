import type { Metadata } from "next";
import { getShippingZones } from "@/lib/shipping";
import { CartView } from "./CartView";

export const metadata: Metadata = {
  title: "Tu carrito",
  robots: { index: false },
};

export default async function CartPage() {
  const zones = await getShippingZones();
  return <CartView zones={zones} />;
}

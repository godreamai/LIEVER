"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { Price } from "@/components/ds/Price";
import { Icon } from "@/components/ds/Icon";
import { SpecList } from "@/components/ds/SpecList";
import { useCart } from "@/components/cart-context";
import { WA } from "@/lib/data";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const customWa = WA + encodeURIComponent(`Hola Liever! Me interesa el modelo "${product.name}" pero en otra medida / terminación.`);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <Price value={product.price} size="lg" />
      </div>
      <p className="lead" style={{ color: "var(--text-muted)", margin: "0 0 26px" }}>
        {product.desc}
      </p>
      <div className="row" style={{ maxWidth: 340, justifyContent: "flex-start" }}>
        <Button
          full
          onClick={() => {
            add(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
          }}
          icon={<Icon name={added ? "check" : "shopping-cart"} size={16} color="var(--white)" />}
        >
          {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
        </Button>
        <Button as="a" href={customWa} target="_blank" full variant="secondary" size="sm">
          Pedir en otra medida
        </Button>
      </div>

      <SpecList style={{ marginTop: 28, width: "100%", maxWidth: 440, textAlign: "left" }} items={product.specs} />
    </>
  );
}

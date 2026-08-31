"use client";

import { useState } from "react";
import { MdfSurface } from "@/components/ds/MdfSurface";

export function ProductGallery({
  shots,
}: {
  shots: { src: string | null; alt: string }[];
  widthLabel?: string;
  heightLabel?: string;
  firstSpec?: string;
}) {
  const [shot, setShot] = useState(0);
  return (
    <div>
      <MdfSurface height={400} src={shots[shot].src} alt={shots[shot].alt} />
      <div className="grid gtight" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 12 }}>
        {shots.map((s, i) => (
          <MdfSurface
            key={i}
            height={70}
            src={s.src}
            alt={s.alt}
            onClick={() => setShot(i)}
            style={{ cursor: "pointer", border: "1.5px solid " + (shot === i ? "var(--accent)" : "transparent") }}
          />
        ))}
      </div>
    </div>
  );
}

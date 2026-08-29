"use client";

import React, { useState } from "react";

type CardProps = {
  as?: React.ElementType;
  padding?: number | string;
  interactive?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function Card({ as = "div", padding = 0, interactive = false, style, children, ...rest }: CardProps) {
  const Tag = as;
  const [hover, setHover] = useState(false);
  return (
    <Tag
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${interactive && hover ? "var(--accent)" : "var(--border-card)"}`,
        borderRadius: "var(--radius)",
        boxShadow: "none",
        padding,
        cursor: interactive ? "pointer" : undefined,
        transition: "var(--transition-hover)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

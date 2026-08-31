import React from "react";

const base: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  letterSpacing: "var(--tracking-button)",
  borderRadius: "var(--radius)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textDecoration: "none",
  transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
  boxShadow: "none",
};

const sizes: Record<string, React.CSSProperties> = {
  md: { padding: "14px 28px", fontSize: 14 },
  sm: { padding: "9px 16px", fontSize: 12 },
};

const variants: Record<string, React.CSSProperties> = {
  primary: { background: "var(--action-primary)", color: "var(--action-primary-fg)", border: "none" },
  secondary: { background: "transparent", color: "var(--action-secondary-fg)", border: "1.5px solid var(--ink)" },
  ghost: { background: "transparent", color: "var(--ink-soft)", border: "1px solid var(--border-strong)" },
  onDark: { background: "var(--action-primary)", color: "var(--action-primary-fg)", border: "none" },
};

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  as?: "button" | "a";
  full?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  full = false,
  disabled = false,
  icon = null,
  iconRight = null,
  children,
  style,
  className = "",
  ...rest
}: ButtonProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      disabled={as === "button" ? disabled : undefined}
      className={`btn btn--${variant} ${className}`.trim()}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        width: full ? "100%" : undefined,
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? "none" : undefined,
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </Tag>
  );
}

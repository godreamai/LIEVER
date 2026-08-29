import React from "react";

type InputProps = {
  label?: string;
  mono?: boolean;
  style?: React.CSSProperties;
  wrapStyle?: React.CSSProperties;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, mono = true, style, wrapStyle, ...rest }: InputProps) {
  return (
    <label style={{ display: "block", ...wrapStyle }}>
      {label && (
        <span
          style={{
            display: "block",
            fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 6,
          }}
        >
          {label}
        </span>
      )}
      <input
        style={{
          width: "100%",
          padding: 10,
          border: "1px solid var(--border-input)",
          borderRadius: "var(--radius)",
          background: "var(--surface-card)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: "var(--text-body)",
          outline: "none",
          ...style,
        }}
        {...rest}
      />
    </label>
  );
}

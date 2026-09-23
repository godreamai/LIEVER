const MESSAGE = "Envíos a todo el país · Retiro sin cargo en nuestro taller de San Nicolás";

export function TopAnnouncementBar() {
  return (
    <div
      style={{
        background: "var(--bg-alt)",
        color: "var(--text-muted)",
        fontSize: 11,
        fontWeight: 500,
        minHeight: 32,
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        letterSpacing: "0.04em",
        borderBottom: "1px solid var(--border-hairline)",
      }}
    >
      {MESSAGE}
    </div>
  );
}

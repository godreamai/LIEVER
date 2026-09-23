import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ sinpermiso?: string }> }) {
  const { sinpermiso } = await searchParams;
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-alt)", padding: 20 }}>
      <LoginForm noAccess={sinpermiso === "1"} />
    </div>
  );
}

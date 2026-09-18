import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-alt)", padding: 20 }}>
      <LoginForm />
    </div>
  );
}

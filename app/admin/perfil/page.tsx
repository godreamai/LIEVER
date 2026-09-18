import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div data-screen-label="Admin · Mi perfil">
      <h2 style={{ fontSize: 26, margin: "0 0 22px" }}>Mi perfil</h2>
      <ProfileForm email={user?.email ?? ""} fullName={(user?.user_metadata?.full_name as string) ?? ""} />
    </div>
  );
}

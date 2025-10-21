import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { ClientDashboard } from "@/components/admin/ClientDashboard";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Just verify user is admin, let client component handle data loading
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    (profile.role !== "admin" && profile.role !== "super_admin")
  ) {
    redirect("/auth/login");
  }

  return <ClientDashboard />;
}

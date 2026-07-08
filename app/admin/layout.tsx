import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold text-aube-600">
              Les Enfants de l&apos;Aube{" "}
              <span className="ml-1 rounded bg-aube-100 px-1.5 py-0.5 text-xs font-semibold text-aube-800">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-neutral-600">
              <Link href="/admin" className="hover:text-aube-600">
                Tableau de bord
              </Link>
              <span className="cursor-default text-neutral-400" title="Sprint 3">
                Cours &amp; stages
              </span>
              <span className="cursor-default text-neutral-400" title="Sprint 3">
                Inscriptions
              </span>
              <span className="cursor-default text-neutral-400" title="Sprint 3">
                Paiements
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}

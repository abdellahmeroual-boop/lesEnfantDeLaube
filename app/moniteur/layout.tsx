import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function MoniteurLayout({
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

  if (profile?.role !== "monitor") {
    redirect("/espace");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-3">
          <Link href="/moniteur" className="font-bold text-aube-600">
            Les Enfants de l&apos;Aube{" "}
            <span className="ml-1 rounded bg-sky-100 px-1.5 py-0.5 text-xs font-semibold text-sky-800">
              Moniteur
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-500 sm:inline">
              {profile.full_name || user.email}
            </span>
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

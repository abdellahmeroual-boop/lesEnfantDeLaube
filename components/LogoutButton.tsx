"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:border-aube-400 hover:text-aube-600"
    >
      Déconnexion
    </button>
  );
}

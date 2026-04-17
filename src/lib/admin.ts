import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/env";

export async function requireAdmin() {
  if (!isAuthConfigured()) {
    throw new Error("Admin auth is not configured.");
  }

  const session = await getAuthSession();
  if (!session?.user?.email) {
    redirect("/admin");
  }

  return session;
}

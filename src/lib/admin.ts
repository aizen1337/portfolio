import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { isAuthConfigured, isDevelopmentAdminBypassEnabled } from "@/lib/env";

export async function requireAdmin() {
  if (!isAuthConfigured() && !isDevelopmentAdminBypassEnabled()) {
    throw new Error("Admin auth is not configured.");
  }

  const session = await getAuthSession();
  if (!session?.user?.email) {
    redirect("/admin");
  }

  return session;
}

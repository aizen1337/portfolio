"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AdminSignInButton() {
  return (
    <Button onClick={() => signIn("github")} size="lg">
      Continue with GitHub
    </Button>
  );
}

export function AdminSignOutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/admin" })} variant="outline">
      Sign out
    </Button>
  );
}

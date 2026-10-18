"use client";

import { Button } from "@heroui/react";
import { useSignOut } from "@/lib/use-sign-out";

export default function SignOutButton() {
  const { signOut, pending } = useSignOut();
  return (
    <Button variant="danger-soft" size="md" isPending={pending} onPress={signOut}>
      {pending ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
    </Button>
  );
}

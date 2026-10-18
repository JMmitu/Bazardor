"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "./auth-client";

/** Signs the user out (invalidating the server session) and refreshes the UI. */
export function useSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const { error } = await authClient.signOut();
    setPending(false);
    if (error) {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }
    toast.success("সফলভাবে সাইন আউট হয়েছে।");
    router.push("/");
    router.refresh();
  }

  return { signOut, pending };
}

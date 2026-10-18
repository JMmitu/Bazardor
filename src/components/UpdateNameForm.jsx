"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { validateName } from "@/lib/validation";
import Field from "./Field";

export default function UpdateNameForm({ initialName }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
    const problem = validateName(name);
    setError(problem);
    if (problem) return;

    setPending(true);
    // Supported Better Auth call: updates the signed-in user's own record.
    const { error: apiError } = await authClient.updateUser({ name });
    setPending(false);
    if (apiError) {
      toast.error("তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }
    toast.success("আপনার তথ্য আপডেট হয়েছে।");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="নাম" name="name" defaultValue={initialName} autoComplete="name" error={error} />
      <Button type="submit" variant="primary" size="lg" isPending={pending}>
        {pending ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
      </Button>
    </form>
  );
}

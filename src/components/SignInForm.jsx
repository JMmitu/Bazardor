"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage, validateEmail, validatePassword } from "@/lib/validation";
import AuthCard, { OrDivider } from "./AuthCard";
import Field from "./Field";
import SocialButtons from "./SocialButtons";

export default function SignInForm({ callbackUrl, providers }) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const next = { email: validateEmail(email), password: validatePassword(password, { min: 1 }) };
    setErrors(next);
    if (next.email || next.password) return;

    setPending(true);
    const { error } = await authClient.signIn.email({ email, password });
    setPending(false);
    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে।");
    router.push(callbackUrl);
    router.refresh();
  }

  const signUpHref = callbackUrl !== "/" ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signup";

  return (
    <AuthCard title="সাইন ইন" subtitle="আপনার অ্যাকাউন্টে প্রবেশ করুন">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="ইমেইল" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field label="পাসওয়ার্ড" name="password" type="password" autoComplete="current-password" error={errors.password} />
        <Button type="submit" variant="primary" size="lg" fullWidth isPending={pending}>
          {pending ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
        </Button>
      </form>
      <OrDivider />
      <SocialButtons callbackUrl={callbackUrl} enabled={providers} />
      <p className="text-center text-sm">
        অ্যাকাউন্ট নেই? <Link href={signUpHref} className="font-semibold text-brand hover:text-brand-deep">সাইন আপ করুন</Link>
      </p>
    </AuthCard>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage, validateEmail, validateName, validatePassword } from "@/lib/validation";
import AuthCard, { OrDivider } from "./AuthCard";
import Field from "./Field";
import SocialButtons from "./SocialButtons";

export default function SignUpForm({ callbackUrl, providers }) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const next = { name: validateName(name), email: validateEmail(email), password: validatePassword(password) };
    setErrors(next);
    if (next.name || next.email || next.password) return;

    setPending(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setPending(false);
    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
    router.push(callbackUrl !== "/" ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signin");
  }

  const signInHref = callbackUrl !== "/" ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signin";

  return (
    <AuthCard title="সাইন আপ" subtitle="নতুন অ্যাকাউন্ট তৈরি করুন">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="নাম" name="name" autoComplete="name" error={errors.name} />
        <Field label="ইমেইল" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field label="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)" name="password" type="password" autoComplete="new-password" error={errors.password} />
        <Button type="submit" variant="primary" size="lg" fullWidth isPending={pending}>
          {pending ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "সাইন আপ"}
        </Button>
      </form>
      <OrDivider />
      <SocialButtons callbackUrl={callbackUrl} enabled={providers} />
      <p className="text-center text-sm">
        অ্যাকাউন্ট আছে? <Link href={signInHref} className="font-semibold text-brand hover:text-brand-deep">সাইন ইন করুন</Link>
      </p>
    </AuthCard>
  );
}

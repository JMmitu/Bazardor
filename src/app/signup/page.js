import { redirect } from "next/navigation";
import SignUpForm from "@/components/SignUpForm";
import { enabledSocialProviders } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { safeCallbackUrl } from "@/lib/format";

export const metadata = { title: "সাইন আপ" };

export default async function SignUpPage({ searchParams }) {
  const { callbackUrl: raw } = await searchParams;
  const callbackUrl = safeCallbackUrl(raw);
  if (await getSession()) redirect(callbackUrl);
  return <SignUpForm callbackUrl={callbackUrl} providers={enabledSocialProviders} />;
}

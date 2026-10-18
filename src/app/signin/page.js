import { redirect } from "next/navigation";
import SignInForm from "@/components/SignInForm";
import { enabledSocialProviders } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { safeCallbackUrl } from "@/lib/format";

export const metadata = { title: "সাইন ইন" };

export default async function SignInPage({ searchParams }) {
  const { callbackUrl: raw } = await searchParams;
  const callbackUrl = safeCallbackUrl(raw);
  if (await getSession()) redirect(callbackUrl);
  return <SignInForm callbackUrl={callbackUrl} providers={enabledSocialProviders} />;
}

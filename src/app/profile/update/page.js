import Link from "next/link";
import UpdateNameForm from "@/components/UpdateNameForm";
import { requireSession } from "@/lib/session";

export const metadata = { title: "তথ্য আপডেট" };

export default async function UpdateProfilePage() {
  const { user } = await requireSession("/profile/update");
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold leading-10">তথ্য আপডেট করুন</h1>
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <UpdateNameForm initialName={user.name} />
      </div>
      <Link href="/profile" className="text-sm text-brand hover:text-brand-deep">← প্রোফাইলে ফিরে যান</Link>
    </div>
  );
}

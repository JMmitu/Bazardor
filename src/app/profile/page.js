import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import SignOutButton from "@/components/SignOutButton";
import { requireSession } from "@/lib/session";

export const metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  const { user } = await requireSession("/profile");
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  const joined = user.createdAt
    ? new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka" }).format(new Date(user.createdAt))
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold leading-10">আমার প্রোফাইল</h1>

      <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-2xl font-bold text-white" aria-hidden="true">{initial}</span>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold">{user.name}</p>
            <p className="truncate text-ink/70">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </section>

      <section aria-labelledby="info-title" className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h2 id="info-title" className="text-xl font-bold">তথ্য</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink/70">নাম</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/70">ইমেইল</dt>
            <dd className="break-all font-medium">{user.email}</dd>
          </div>
          {joined && (
            <div>
              <dt className="text-sm text-ink/70">যোগদানের তারিখ</dt>
              <dd className="font-medium">{joined}</dd>
            </div>
          )}
        </dl>
        <Link href="/profile/update" className={buttonVariants({ variant: "primary", size: "md" })}>আপডেট</Link>
      </section>
    </div>
  );
}

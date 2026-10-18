"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useSignOut } from "@/lib/use-sign-out";
import BengaliDate from "./BengaliDate";

function UserMenu({ user }) {
  const { signOut, pending } = useSignOut();
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  const closeMenu = () => document.activeElement?.blur?.();

  return (
    <div className="d-dropdown d-dropdown-end">
      <button
        type="button"
        tabIndex={0}
        aria-label={`${user.name || "আমার"} অ্যাকাউন্ট মেনু`}
        className="flex size-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-white transition hover:bg-brand-strong"
      >
        {initial}
      </button>
      <div
        tabIndex={0}
        className="d-dropdown-content z-50 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-lg"
      >
        <div className="px-3 py-2">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-xs text-ink/70">{user.email}</p>
        </div>
        <ul className="d-menu w-full p-0">
          <li><Link href="/profile" onClick={closeMenu}>আমার প্রোফাইল</Link></li>
          <li><Link href="/profile/update" onClick={closeMenu}>তথ্য আপডেট করুন</Link></li>
          <li>
            <button type="button" disabled={pending} onClick={() => { closeMenu(); signOut(); }} className="text-up">
              {pending ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AuthArea() {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-10 w-24 animate-pulse rounded-lg bg-base-300 motion-reduce:animate-none" aria-hidden="true" />;
  }
  if (data?.user) return <UserMenu user={data.user} />;

  return (
    <div className="flex items-center gap-2">
      <Link href="/signin" className={buttonVariants({ variant: "outline", size: "md" })}>সাইন ইন</Link>
      <Link href="/signup" className={buttonVariants({ variant: "primary", size: "md" })}>সাইন আপ</Link>
    </div>
  );
}

export default function Navbar({ categories }) {
  const pathname = usePathname();
  const chips = [{ slug: "", name: "সব", href: "/" }, ...categories.map((c) => ({ slug: c.slug, name: c.name, href: `/category/${c.slug}` }))];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label="বাজার দর — হোম">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand" aria-hidden="true">
            <Image src="/images/logo-icon.png" alt="" width={18} height={18} className="size-5 brightness-0 invert" />
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-bold">বাজার দর</span>
            <BengaliDate className="block text-xs text-ink/70" />
          </span>
        </Link>
        <AuthArea />
      </div>
      <nav aria-label="পণ্যের ক্যাটাগরি" className="border-t border-base-200">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          {chips.map((c) => {
            const active = c.href === "/" ? pathname === "/" : pathname === c.href;
            return (
              <li key={c.href} className="shrink-0">
                <Link
                  href={c.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition motion-reduce:transition-none ${
                    active ? "bg-brand text-white" : "text-ink hover:bg-page"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

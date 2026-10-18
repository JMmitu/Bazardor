import Image from "next/image";
import { buttonVariants } from "@heroui/react";
import BengaliDate from "./BengaliDate";

export default function Hero() {
  return (
    <section className="flex flex-col-reverse items-center gap-6 rounded-3xl border border-line bg-surface p-6 shadow-sm md:flex-row md:justify-between md:p-10">
      <div className="max-w-xl text-center md:text-left">
        <p className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand-deep">
          আজকের তারিখ: <BengaliDate className="ml-1" />
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl md:leading-[1.25]">
          আজকের বাজারের দাম এক নজরে
        </h1>
        <p className="mt-3 text-base text-ink/75">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার দাম দেখুন, গতকালের তুলনায় কোনটির দাম বাড়ল বা কমল তা জানুন।
        </p>
        <a href="#সব-পণ্য" className={`${buttonVariants({ variant: "primary", size: "lg" })} mt-6`}>
          সব পণ্য দেখুন
        </a>
      </div>
      <Image
        src="/images/hero-basket.png"
        alt="তাজা ফল ও সবজিতে ভরা একটি ঝুড়ির ছবি"
        width={315}
        height={263}
        priority
        className="h-auto w-56 md:w-[315px]"
      />
    </section>
  );
}

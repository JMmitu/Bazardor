import StateMessage from "@/components/StateMessage";

export const metadata = { title: "পেজ পাওয়া যায়নি" };

export default function NotFound() {
  return (
    <StateMessage
      icon="🧺"
      title="পেজটি খুঁজে পাওয়া যায়নি"
      message="আপনি যে পেজ বা পণ্যটি খুঁজছেন তা নেই, অথবা লিংকটি ভুল।"
      homeLink
    />
  );
}

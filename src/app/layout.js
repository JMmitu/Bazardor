import "@fontsource/hind-siliguri/latin-400.css";
import "@fontsource/hind-siliguri/latin-600.css";
import "@fontsource/hind-siliguri/latin-700.css";
import "@fontsource/hind-siliguri/bengali-400.css";
import "@fontsource/hind-siliguri/bengali-500.css";
import "@fontsource/hind-siliguri/bengali-600.css";
import "@fontsource/hind-siliguri/bengali-700.css";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Render per request. API responses are still cached by Next's data cache
// (see lib/api.js), but a failed fetch is never frozen into a prerendered page.
export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "বাজার দর — আজকের বাজারের দাম এক নজরে", template: "%s | বাজার দর" },
  description: "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার আজকের দাম ও দামের পরিবর্তন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="bazardor">
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          মূল অংশে যান
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <Footer />
        {/* Single, global toast container. */}
        <Toaster
          position="top-center"
          toastOptions={{ style: { fontFamily: "inherit" }, duration: 4000 }}
        />
      </body>
    </html>
  );
}

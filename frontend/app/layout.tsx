import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";

// Self-hosted variable font (Arabic + Latin coverage) — bundled locally so
// the app builds and renders correctly with zero external font requests,
// rather than depending on Google Fonts being reachable at build time.
const cairo = localFont({
  src: "./fonts/Cairo-Variable.ttf",
  weight: "200 1000",
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة توثيق العمليات الميدانية",
  description: "منصة موثوقة لتسجيل وإدارة وتوثيق العمليات الميدانية إلكترونيًا",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

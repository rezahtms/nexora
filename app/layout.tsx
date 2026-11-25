import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "@/lib/providers/providers";
import ToastProvider from "@/components/shared/ToastProvider";
import "./globals.css";

const geist = localFont({ src: "../public/fonts/geist-latin.woff2", variable: "--font-geist-sans", weight: "100 900", display: "swap" });
const geistMono = localFont({ src: "../public/fonts/geist-mono-latin.woff2", variable: "--font-geist-mono", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nexora.app"),
  title: { default: "Nexora CRM", template: "%s | Nexora CRM" },
  description: "A thoughtful customer workspace to keep every relationship organized.",
  openGraph: { type: "website", siteName: "Nexora CRM", title: "Nexora CRM", description: "A thoughtful customer workspace to keep every relationship organized." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f8fc" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} style-nova h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>{children}</Providers>
        <ToastProvider />
      </body>
    </html>
  );
}

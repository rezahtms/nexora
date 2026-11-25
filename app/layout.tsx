import type { Metadata, Viewport } from "next";
import Providers from "@/lib/providers/providers";
import ToastProvider from "@/components/shared/ToastProvider";
import { geistMono, geistSans } from "./font";
import "./globals.css";

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} style-nova h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>{children}</Providers>
        <ToastProvider />
      </body>
    </html>
  );
}

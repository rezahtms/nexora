"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return <Toaster position="top-right" gutter={12} toastOptions={{ duration: 4000, style: { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.85rem", boxShadow: "0 12px 36px rgb(15 23 42 / 12%)", padding: "14px 16px", maxWidth: "min(420px, calc(100vw - 32px))" }, success: { iconTheme: { primary: "oklch(0.55 0.16 155)", secondary: "white" } }, error: { iconTheme: { primary: "var(--destructive)", secondary: "white" } } }} />;
}

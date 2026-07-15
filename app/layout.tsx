import type { Metadata } from "next";
import "@fontsource-variable/montserrat";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

export const metadata: Metadata = {
  title: "EXPO La Universal ACOSA 2026",
  description: "Formulario de registro para EXPO La Universal ACOSA 2026.",
  icons: {
    icon: "/favicon-brand.ico",
    shortcut: "/favicon-brand.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

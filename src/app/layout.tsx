import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";

export const metadata: Metadata = {
  title: "AI Content Publisher",
  description: "Generate, review, and publish social content seamlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-language="th">
      <body
        className="antialiased"
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

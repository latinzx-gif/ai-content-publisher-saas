import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";

const ekkamaiVibe = localFont({
  src: [
    {
      path: "../../public/fonts/EkkamaiVibe/EkkamaiVibe-thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/EkkamaiVibe/EkkamaiVibe-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/EkkamaiVibe/EkkamaiVibe-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/EkkamaiVibe/EkkamaiVibe-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/EkkamaiVibe/EkkamaiVibe-Heavy.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-ekkamai",
});

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
    <html lang="en" className={ekkamaiVibe.variable}>
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

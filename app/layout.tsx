import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrokeLads — Get it on",
  description: "Get your bets on the week's fixtures, son.",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
        <footer className="text-muted-foreground px-4 py-3 text-center text-xs">
          A portfolio demo. Play money only. No affiliation with Ladbrokes.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}

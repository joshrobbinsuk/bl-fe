import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AmplifyProvider } from "@/components/providers/amplify-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrokeLads - Sports Betting Platform",
  description: "Place bets on your favorite sports fixtures",
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
        <AmplifyProvider>
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </AmplifyProvider>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { EnvIndicator } from "./components/EnvIndicator";

export const metadata: Metadata = {
  title: "DegenDuel | Strategic Crypto Portfolio Competition",
  description: "Compete in strategic Solana token portfolio contests with AI-driven gameplay. Form alliances, make strategic moves, and eliminate opponents to win SOL rewards.",
  icons: {
    icon: '/dice-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <EnvIndicator />
      </body>
    </html>
  );
}

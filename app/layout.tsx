import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AgentCart — agentic checkout, human approved",
  description:
    "An AI shopping agent that creates real PayPal sandbox orders but can never spend your money without approval.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

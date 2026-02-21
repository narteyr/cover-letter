import type { Metadata } from "next";
import { Changa_One } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import "./styles/globals.css";

const changaOne = Changa_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-changa-one",
});

export const metadata: Metadata = {
  title: "AI Cover Letter Generator",
  description: "Generate professional cover letters using AI - Open Source",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${changaOne.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

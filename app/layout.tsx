import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticktock",
  description:
    "Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.variable} antialiased`}
    >
      <body className="md:min-h-screen">{children}</body>
    </html>
  );
}

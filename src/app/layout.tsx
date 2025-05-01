import type { Metadata } from "next";
import { Recursive } from 'next/font/google'
import "./globals.css";
import { Navbar } from "@/components";

const recursive = Recursive({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "ClassyCase - Custom high-quality phone cases",
  description: "Shop the custom generated back covers for your phone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.jpeg" type="image/x-icon" />
      </head>
      <body
        className={recursive.className}
      >
          <Navbar/>
          {children}
      </body>
    </html>
  );
}

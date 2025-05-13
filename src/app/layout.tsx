import type { Metadata } from "next";
import { Recursive } from 'next/font/google'
import "./globals.css";
import { Navbar } from "@/components";
import Footer from "@/components/organisms/Footer";

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
        <link rel="shortcut icon" href="/favicon.jpeg" type="image/x-icon" />
      </head>
      <body
        className={recursive.className}
      >
        <Navbar/>
        <main className="flex flex-col min-h-[calc(100vh-4rem-1px)]">
          <div className="flex-1 flex flex-col h-full">
            {children}
          </div>
          <Footer/>
        </main>
      </body>
    </html>
  );
}

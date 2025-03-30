import type { Metadata } from "next";
import { Recursive } from 'next/font/google'
import "./globals.css";

const recursive = Recursive({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "ClassyCase",
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
        <main className='flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]'>
          {children}
        </main>
      </body>
    </html>
  );
}

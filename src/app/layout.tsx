import { Recursive } from 'next/font/google'
import "./globals.css";
import { Navbar } from "@/components";
import Footer from "@/components/organisms/Footer";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/atoms/Providers";
import { constructMetadata } from "@/lib/utils";

const recursive = Recursive({ subsets: ['latin'] })

export const metadata = constructMetadata();

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
        <main className="flex flex-col min-h-[calc(100vh-4rem-1px)] grainy-light">
          <div className="flex-1 flex flex-col h-full">
            <Providers>{children}</Providers>
          </div>
          <Footer/>
        </main>
        <Toaster richColors position="top-center"/>
      </body>
    </html>
  );
}

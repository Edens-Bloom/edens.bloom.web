import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../styles/main.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eden's Bloom Store",
  description: "Eden's Bloom Store - Next.js storefront and admin app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="app-shell flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

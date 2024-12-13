import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import LayoutWrapper from "@/components/LayoutWrapper";
import AuthProvider from "@/lib/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shopeazz",
  description: "Shop With Eazz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

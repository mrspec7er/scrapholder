import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scrapholder",
  description: "Your one stop solution for stock analytic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " p-3 max-w-screen-xl mx-auto"}>
        {children}
      </body>
    </html>
  );
}

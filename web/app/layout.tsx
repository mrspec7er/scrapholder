import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

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
      <body className={roboto.className + " p-3 max-w-screen-xl mx-auto"}>
        {children}
      </body>
    </html>
  );
}

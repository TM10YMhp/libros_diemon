import type { Metadata } from "next";

import "../globals.css";
import { page_metadata } from "@/config";
import { Providers } from "@/providers";
import { cx } from "@/utils";
import { Geist } from "next/font/google";
import Navbar from "./_components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = page_metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={cx(
          geistSans.variable,
          "font-[family-name:var(--font-geist-sans)]",
        )}
      >
        <main
          className={cx(
            "grid min-h-screen grid-rows-[60px,1fr,60px] gap-2",
            "px-4 m-auto max-w-screen-lg",
          )}
        >
          <Providers>
            <Navbar />
            <section>{children}</section>
          </Providers>
        </main>
      </body>
    </html>
  );
}

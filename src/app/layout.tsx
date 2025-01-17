import type { Metadata } from "next";

import "../globals.css";
import { page_metadata } from "@/config";
import { Providers } from "@/providers";

export const metadata: Metadata = page_metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <main className="px-4 m-auto max-w-screen-lg grid min-h-screen grid-rows-[60px,1fr,60px] gap-4">
          <nav className="flex items-center text-2xl">
            {String(page_metadata.title)}
          </nav>
          <section>
            <Providers>{children}</Providers>
          </section>
        </main>
      </body>
    </html>
  );
}

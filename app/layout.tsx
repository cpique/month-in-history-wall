import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Month in History Wall",
  description:
    "A visual archive of the world, one month at a time.",
};

const themeScript = `(function(){try{var stored=localStorage.getItem("theme");var system=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var theme=stored==="light"||stored==="dark"?stored:system;document.documentElement.setAttribute("data-theme",theme)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
          <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] px-5 py-4 text-xs uppercase tracking-wide text-[var(--text-muted)] lg:px-8">
            <nav aria-label="Site information" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/archive">Archive</Link>
              <Link href="/search">Search</Link>
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/cookies">Cookies</Link>
              <ThemeToggle />
            </nav>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

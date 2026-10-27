import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { STORE_DOMAIN } from "@/lib/support";

export function SupportPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link to="/" className="font-display text-2xl font-black">
            Trove<span className="text-primary">.</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground">
            {STORE_DOMAIN}
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <h1 className="text-4xl font-black">{title}</h1>
        <div className="mt-8 space-y-8 text-[15px] leading-relaxed">{children}</div>
        <Link to="/" className="mt-12 inline-block font-semibold text-primary hover:underline">
          ← Back to store
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

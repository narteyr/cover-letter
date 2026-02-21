"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { HomeLine } from "@untitledui/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <header className="flex items-center justify-between px-6 md:px-12 py-4 shrink-0">
        <Link href="/" className="shrink-0 text-primary hover:opacity-90 transition-opacity">
          <div className="shrink-0">
            <h1 className="text-3xl font-normal text-brand-700" style={{ fontFamily: "var(--font-changa-one)" }}>
              internaly.
            </h1>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold text-brand-200 mb-2">404</p>
          <h2 className="text-display-sm font-bold text-primary mb-2">Page not found</h2>
          <p className="text-secondary mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
            doesn&apos;t exist.
          </p>
          <Button href="/" size="lg" color="primary" iconLeading={HomeLine}>
            Back to home
          </Button>
        </div>
      </main>
    </div>
  );
}

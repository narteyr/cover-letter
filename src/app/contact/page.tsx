"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { ArrowLeft } from "@untitledui/icons";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <header className="flex items-center justify-between px-6 md:px-12 py-4 shrink-0">
        <Link href="/" className="shrink-0 text-primary hover:opacity-90 transition-opacity">
          <div className="shrink-0">
            <h1
              className="text-3xl font-normal text-brand-700"
              style={{ fontFamily: "var(--font-changa-one)" }}
            >
              internaly.
            </h1>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/contact"
            className="text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
          >
            Contact Us
          </Link>
          <Button href="/cover-letter" size="md" color="primary">
            Generate my letter
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          <h2 className="text-display-md font-bold text-primary">Get in touch</h2>
          <p className="text-secondary">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <a
            href="mailto:hello@internaly.com"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            hello@internaly.com
          </a>
          <div className="pt-4">
            <Button href="/" size="lg" color="secondary" iconLeading={ArrowLeft}>
              Back to home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

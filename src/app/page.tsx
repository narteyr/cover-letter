import Link from "next/link";
import Image from "next/image";
import { Star01, Lightning01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const LOGO_SVGS = [
  { src: "/svgs/Amazon_logo.svg", alt: "Amazon" },
  { src: "/svgs/pinterest.svg", alt: "Pinterest" },
  { src: "/svgs/nike_logo.svg", alt: "Nike" },
  { src: "/svgs/walmart.svg", alt: "Walmart" },
  { src: "/svgs/Microsoft.svg", alt: "Microsoft" },
  { src: "/svgs/google.svg", alt: "Google" },
  { src: "/svgs/chase_logo.svg", alt: "Chase" },
  { src: "/svgs/apple_logo.svg", alt: "Apple" },
  { src: "/svgs/goldman_sachs.svg", alt: "Goldman Sachs" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-12 py-4 shrink-0">
        <Link href="/" className="shrink-0 text-primary hover:opacity-90 transition-opacity">
          <div className="shrink-0">
            <h1 className="text-3xl font-normal text-brand-700" style={{ fontFamily: 'var(--font-changa-one)' }}>internaly.</h1>
          </div>
        </Link>
      </header>

      {/* Hero - gradient background */}
      <main className="flex-1 min-h-0 px-6 md:px-12 py-6 md:py-8 overflow-auto">
        <div
          className={cx(
            "max-w-[1280px] mx-auto grid gap-8 md:grid-cols-2 md:gap-10 items-center",
            "bg-gradient-to-r from-brand-50 via-brand-100/80 to-primary rounded-3xl -mx-2 px-8 md:px-16 py-8 md:py-10"
          )}
        >
          {/* Left - Copy + CTA */}
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <h1 className="text-display-md md:text-display-lg font-bold text-primary leading-tight tracking-tight">
              Cover Letter Generator
              <br />
            
              <span className="text-brand-secondary">to Win the Job</span>
            </h1>
            <p className="text-lg text-secondary max-w-md">
              Use our AI-powered cover letter generator to create a letter that wows employers!
            </p>
            <div className="flex flex-col gap-3">
              <Button href="/cover-letter" size="xl" color="primary" className="w-fit">
                Generate my letter
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-primary">EXCELLENT</span>
                <div className="flex items-center gap-0.5 text-utility-success-600">
                  {[...Array(5)].map((_, i) => (
                    <Star01 key={i} className={cx("size-4", i < 4 ? "fill-current" : "fill-utility-success-400")} />
                  ))}
                </div>
                <span className="text-tertiary">4.7 out of 5 based on 618 reviews</span>
                <span className="text-xs text-utility-success-600 font-medium">Trustpilot</span>
              </div>
            </div>
          </div>

          {/* Right - Cover letter mockup */}
          <div className="relative order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              {/* Cover letter card */}
              <div className="relative bg-primary rounded-xl shadow-xl border border-secondary p-6 md:p-8 transform rotate-[-1deg] overflow-hidden">
                {/* Diagonal accent lines top-left */}
                <div className="absolute top-0 left-0 w-24 h-24 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-200/80 to-transparent" />
                </div>

                {/* Badge - top-left to avoid overlapping sender block */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-lg bg-brand-solid px-2.5 py-1.5 text-xs font-medium text-white shadow-xs">
                  <Lightning01 className="size-3.5" />
                  Get the job 2x faster¹
                </div>

                {/* Letter content */}
                <div className="relative space-y-3 text-sm text-primary">
                  <div className="text-right space-y-0.5">
                    <p className="font-semibold text-xs tracking-widest text-secondary">JOYCE REED</p>
                    <p className="text-tertiary">Austin, TX</p>
                    <p className="text-tertiary">joyce.reed@email.com</p>
                  </div>
                  <p className="text-tertiary">February 21, 2026</p>
                  <div className="space-y-0.5">
                    <p className="font-medium">Sarah Chen</p>
                    <p className="text-tertiary">Head of Engineering</p>
                    <p>Stripe</p>
                  </div>
                  <p className="font-medium">Dear Sarah Chen,</p>
                  <p className="leading-relaxed">
                    Your team&apos;s work on Stripe Billing has directly shaped how I think about developer experience…
                  </p>
                  <p className="leading-relaxed text-tertiary">
                    [Tailored paragraphs highlighting relevant experience and achievements…]
                  </p>
                  <p className="font-medium">Yours sincerely,</p>
                  <p className="font-semibold">Joyce Reed</p>
                </div>
              </div>

              {/* Profile circle */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-primary shadow-xl bg-brand-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--color-brand-300),transparent)] opacity-40" />
                <span className="relative text-2xl md:text-3xl text-brand-secondary font-semibold">JR</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Company logos marquee */}
      <footer className="shrink-0 py-5 overflow-hidden">
        <p className="text-sm text-tertiary text-center mb-4 px-6">
          Our customers have been hired by ²
        </p>
        <div className="relative flex justify-center overflow-hidden px-4">
          <div
            className="flex items-center gap-6 md:gap-8"
            style={{
              width: "max-content",
              animation: "marquee-logos 25s linear infinite",
            }}
          >
            {/* Two identical sets - gap between sets separates Goldman Sachs from Amazon */}
            {[1, 2].map((set) => (
              <div key={set} className="flex shrink-0 items-center gap-6 md:gap-8">
                {LOGO_SVGS.map(({ src, alt }) => (
                  <div
                    key={`${alt}-${set}`}
                    className="flex shrink-0 items-center justify-center grayscale opacity-70 hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={80}
                      height={28}
                      className="h-5 md:h-6 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

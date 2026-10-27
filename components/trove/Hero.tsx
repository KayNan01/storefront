import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Sparkles, Truck, Zap } from "lucide-react";

import { formatMoney, type Product } from "@/lib/catalog";

// Each headline: `before` + highlighted rotating word + `after`.
// The highlighted word cycles through `words`, then the whole headline changes.
const MESSAGES = [
  {
    before: "Stuff you'll actually end up using",
    words: ["every day.", "at your desk.", "around the house.", "on the go."],
    after: "",
    text: "Clever gadgets, desk upgrades and little home problem-solvers. We sort through the noise so you don't end up with cheap junk.",
  },
  {
    before: "The internet's most-wanted",
    words: ["gadgets", "glow-ups", "home hacks", "viral finds"],
    after: "are here.",
    text: "Gadgets, style and smart-home must-haves — hand-picked from what's blowing up right now.",
  },
  {
    before: "Curated internet",
    words: ["favorites", "gadgets", "home finds", "desk upgrades"],
    after: "that are actually worth it.",
    text: "We keep adding practical tech and lifestyle finds that make daily life just a little easier.",
  },
];

const WORD_MS = 2200;

// Card placement for the floating product collage (desktop).
const SPOTS = [
  "left-0 top-6 w-52 -rotate-6",
  "right-2 top-0 w-48 rotate-6 [animation-delay:1.2s]",
  "left-36 top-72 w-52 rotate-3 [animation-delay:2.4s]",
];

function RotatingMessage() {
  const [step, setStep] = useState({ msg: 0, word: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setStep(({ msg, word }) => {
        const current = MESSAGES[msg] ?? MESSAGES[0]!;
        if (word + 1 < current.words.length) return { msg, word: word + 1 };
        return { msg: (msg + 1) % MESSAGES.length, word: 0 };
      });
    }, WORD_MS);
    return () => clearInterval(t);
  }, []);
  const m = MESSAGES[step.msg] ?? MESSAGES[0]!;
  return (
    <div aria-live="polite" className="min-h-[13rem] sm:min-h-[15rem] lg:min-h-[17rem]">
      <h1
        key={`t${step.msg}`}
        className="word-in mt-5 text-4xl font-black font-display leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
      >
        {m.before}{" "}
        <span
          key={`w${step.msg}-${step.word}`}
          className="word-in highlight-pop inline-block text-primary"
        >
          {m.words[step.word]}
        </span>
        {m.after && <> {m.after}</>}
      </h1>
      <p
        key={`p${step.msg}`}
        className="word-in mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
      >
        {m.text}
      </p>
    </div>
  );
}

function ProductBubble({ product, className }: { product: Product; className: string }) {
  const img = product.images.edges[0]?.node.url;
  const price = product.priceRange.minVariantPrice;
  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.handle }}
      className={`float-slow group absolute block rounded-3xl border bg-card p-2.5 shadow-elevated transition-transform duration-300 hover:z-10 hover:scale-105 ${className}`}
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
        {img && (
          <img
            src={img}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-1 pb-0.5 pt-2">
        <p className="line-clamp-1 text-xs font-semibold">{product.title}</p>
        <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">
          {formatMoney(price.amount, price.currencyCode)}
        </span>
      </div>
    </Link>
  );
}

export function Hero({ products = [] }: { products?: Product[] }) {
  const featured = products.filter((p) => p.images.edges.length > 0).slice(0, 3);

  return (
    <section className="bg-hero relative overflow-hidden">
      <div
        aria-hidden
        className="blob-drift absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="blob-drift absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl [animation-delay:-7s]"
      />
      <div
        aria-hidden
        className="blob-drift absolute left-1/2 top-1/3 h-40 w-40 rounded-full bg-pop/40 blur-3xl [animation-delay:-3s]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div className="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-bold shadow-card">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            New picks added regularly
          </span>
          <RotatingMessage />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#shop"
              className="cta-pulse shine group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Explore the collection{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              to="/finder"
              className="inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3.5 text-sm font-bold transition-colors hover:border-primary hover:text-primary"
            >
              <Sparkles className="h-4 w-4" /> Help me choose
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-primary" /> Free US shipping over $50
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" /> 30-day easy returns
            </li>
            <li className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" /> Real human support
            </li>
          </ul>
        </div>

        {featured.length > 0 && (
          <>
            {/* Desktop: floating collage */}
            <div className="relative hidden h-[34rem] lg:block">
              <div
                aria-hidden
                className="spin-slow absolute right-6 top-80 flex h-28 w-28 items-center justify-center rounded-full bg-pop text-pop-foreground shadow-elevated"
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                  <defs>
                    <path id="hero-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="fill-current text-[11px] font-bold uppercase tracking-[0.2em]">
                    <textPath href="#hero-circle">Trending now • New drops • </textPath>
                  </text>
                </svg>
                <Zap className="h-7 w-7" />
              </div>
              {featured.map((p, i) => (
                <ProductBubble key={p.id} product={p} className={SPOTS[i] ?? ""} />
              ))}
            </div>

            {/* Mobile/tablet: swipeable strip */}
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:hidden">
              {featured.map((p, i) => {
                const img = p.images.edges[0]?.node.url;
                return (
                  <Link
                    key={p.id}
                    to="/product/$handle"
                    params={{ handle: p.handle }}
                    className={`fade-up w-40 shrink-0 snap-start rounded-3xl border bg-card p-2 shadow-card ${i % 2 ? "rotate-2" : "-rotate-2"}`}
                    style={{ animationDelay: `${200 + i * 120}ms` }}
                  >
                    <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                      {img && (
                        <img src={img} alt={p.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <p className="mt-2 line-clamp-1 px-1 text-xs font-semibold">{p.title}</p>
                    <p className="px-1 text-sm font-black text-primary">
                      {formatMoney(
                        p.priceRange.minVariantPrice.amount,
                        p.priceRange.minVariantPrice.currencyCode,
                      )}
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

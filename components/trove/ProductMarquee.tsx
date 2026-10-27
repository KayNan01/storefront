import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { Product } from "@/lib/catalog";

const SPEED = 40; // px per second while auto-scrolling
const RESUME_AFTER = 2500; // ms of no interaction before auto-scroll resumes

export function ProductMarquee({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);
  const hovering = useRef(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  // Repeat so one segment is always wider than the screen; three segments let us wrap both ways.
  const base: Product[] = [];
  if (products.length > 0) while (base.length < 8) base.push(...products);
  const loop = [...base, ...base, ...base];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || base.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const segment = () => el.scrollWidth / 3;
    el.scrollLeft = segment();
    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const seg = segment();
      const auto = !reduce && !hovering.current && !drag.current && now > pausedUntil.current;
      if (auto) {
        pos += SPEED * dt;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
      }
      // Keep the view inside the middle segment so it never runs out in either direction.
      if (pos >= seg * 2) {
        pos -= seg;
        el.scrollLeft = pos;
      } else if (pos < seg * 0.5) {
        pos += seg;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [base.length]);

  if (products.length === 0) return null;

  const pause = () => {
    pausedUntil.current = performance.now() + RESUME_AFTER;
  };

  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    pause();
    const card = el.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * width * 2, behavior: "smooth" });
  };

  return (
    <section aria-label="Trending now" className="relative border-y bg-background py-6">
      <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 animate-pulse text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Trending now</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => step(-1)}
            aria-label="Previous products"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-card shadow-card transition-all hover:-translate-x-0.5 hover:border-primary hover:text-primary active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => step(1)}
            aria-label="Next products"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-card shadow-card transition-all hover:translate-x-0.5 hover:border-primary hover:text-primary active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="marquee-mask">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex cursor-grab gap-4 overflow-x-auto px-4 py-2 active:cursor-grabbing"
          onMouseEnter={() => {
            hovering.current = true;
          }}
          onMouseLeave={() => {
            hovering.current = false;
            drag.current = null;
          }}
          onTouchStart={pause}
          onTouchMove={pause}
          onWheel={pause}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") return;
            const el = scrollerRef.current;
            if (el) drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            const el = scrollerRef.current;
            if (!d || !el) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > 5) d.moved = true;
            el.scrollLeft = d.left - dx;
          }}
          onPointerUp={() => {
            pause();
            setTimeout(() => {
              drag.current = null;
            }, 0);
          }}
          onClickCapture={(e) => {
            if (drag.current?.moved) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {loop.map((p, i) => {
            const img = p.images.edges[0]?.node.url;
            const clone = i < base.length || i >= base.length * 2;
            return (
              <Link
                key={`${p.id}-${i}`}
                data-card
                to="/product/$handle"
                params={{ handle: p.handle }}
                draggable={false}
                aria-hidden={clone}
                tabIndex={clone ? -1 : 0}
                className="group flex w-64 shrink-0 select-none items-center gap-3 rounded-2xl border bg-card p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  {img && (
                    <img
                      src={img}
                      alt={p.title}
                      draggable={false}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{p.title}</p>
                  <p className="mt-1 text-sm font-black text-primary">
                    ${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

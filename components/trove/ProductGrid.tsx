import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, PackageSearch } from "lucide-react";

import { formatMoney, type Product } from "@/lib/catalog";
import { MOMENTS, productMatchesMoment, useCaseLine, type Moment } from "@/lib/editorial";
import { CATEGORIES, productMatchesFilter } from "@/components/trove/SiteHeader";
import { ProductCard } from "@/components/trove/ProductCard";
import { Reveal } from "@/components/trove/Reveal";

interface ProductGridProps {
  products: Product[];
  filter: string;
  onFilterChange: (filter: string) => void;
  search: string;
  onQuickView: (product: Product) => void;
  onAdded: () => void;
}

function FeaturedCard({ product }: { product: Product }) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.handle }}
      className="group relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-3xl border bg-secondary shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
    >
      {image && (
        <img
          src={image.url}
          alt={image.altText ?? product.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
        Staff pick
      </span>
      <div className="relative p-6 text-background">
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          {useCaseLine(product) ?? "Our favorite right now"}
        </p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-black font-display sm:text-3xl">
          {product.title}
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg font-black">
            {formatMoney(price.amount, price.currencyCode)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 group-hover:underline">
            See why <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  filter,
  onFilterChange,
  search,
  onQuickView,
  onAdded,
}: ProductGridProps) {
  const [moment, setMoment] = useState<Moment | null>(null);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter(
      (product) =>
        productMatchesFilter(product, filter) &&
        productMatchesMoment(product, moment) &&
        (!query || product.title.toLowerCase().includes(query)),
    );
  }, [products, filter, moment, search]);

  const showFeatured = visible.length >= 3 && filter === "All" && !moment && !search.trim();
  const [featured, ...rest] = visible;
  const gridItems = showFeatured ? rest : visible;

  return (
    <section id="shop" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black font-display tracking-tight sm:text-4xl">
            Trending <span className="highlight-pop">Now</span>
          </h2>
          <p className="mt-1 text-muted-foreground">Fresh finds, updated as they go viral.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === category
                  ? "bg-primary text-primary-foreground shadow-card scale-105"
                  : "bg-secondary text-foreground hover:bg-muted hover:-translate-y-0.5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Shop by moment:
        </span>
        {MOMENTS.map((m) => (
          <button
            key={m}
            onClick={() => setMoment(moment === m ? null : m)}
            className={`rounded-md border-2 border-dashed px-3 py-1 font-mono text-xs font-semibold transition-colors ${
              moment === m
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:border-primary/50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed bg-secondary py-20 text-center">
          <PackageSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-bold font-display">No products found</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            The shelves are being stocked — new drops are coming. Check back soon!
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed bg-secondary py-20 text-center">
          <PackageSearch className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-bold font-display">Nothing here yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            No products match this filter — try another one or clear your search.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {showFeatured && featured && (
            <Reveal className="col-span-2 lg:row-span-2">
              <FeaturedCard product={featured} />
            </Reveal>
          )}
          {gridItems.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 80}>
              <ProductCard product={product} onQuickView={onQuickView} onAdded={onAdded} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

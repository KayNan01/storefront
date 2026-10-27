import { useEffect, useMemo, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";

import {
  discountPercent,
  formatMoney,
  productQueryOptions,
  type Product,
  type VariantNode,
} from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/trove/TopBar";
import { SiteHeader } from "@/components/trove/SiteHeader";
import { SiteFooter } from "@/components/trove/SiteFooter";
import { CartDrawer } from "@/components/trove/CartDrawer";
import { TrustBadges } from "@/components/trove/TrustBadges";

export const Route = createFileRoute("/product/$handle")({
  staticData: { sitemap: true },
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(productQueryOptions(params.handle)),
  head: ({ loaderData }) => {
    const product = loaderData ?? null;
    const title = product ? `${product.title} | Trove` : "Product | Trove";
    const description =
      product?.description?.slice(0, 155) ||
      "Shop this find at Trove — free US shipping over $50 and a 30-day guarantee on every order.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(handle));
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState<Record<string, boolean>>({});
  const [actionsVisible, setActionsVisible] = useState(true);
  const actionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // On phones, show a sticky buy bar once the main buttons scroll out of view.
  useEffect(() => {
    const el = actionsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setActionsVisible(entry?.isIntersecting ?? true),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  const variant = useMemo<VariantNode | null>(() => {
    if (!product) return null;
    return (
      product.variants.edges.find(({ node }) =>
        node.selectedOptions.every(
          (opt) => !selectedValues[opt.name] || selectedValues[opt.name] === opt.value,
        ),
      )?.node ??
      product.variants.edges[0]?.node ??
      null
    );
  }, [product, selectedValues]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <SiteHeader compact onOpenCart={() => setCartOpen(false)} />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-3xl font-black font-display">Product not found</h1>
          <p className="mt-2 text-muted-foreground">This find may have sold out or moved.</p>
          <Button asChild className="mt-6 rounded-full font-bold">
            <Link to="/">Back to the store</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const images = product.images.edges.map((edge) => edge.node);
  const discount = discountPercent(product);
  const soldOut =
    product.variants.edges.length > 0 &&
    !product.variants.edges.some((v) => v.node.availableForSale);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice;
  const showCompare = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);

  const addToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Added to cart", { description: product.title });
    setCartOpen(true);
  };

  const buyNow = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions ?? [],
    });
    navigate({ to: "/checkout" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SiteHeader compact onOpenCart={() => setCartOpen(true)} />
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 pb-28 pt-5 sm:pt-8 lg:pb-8">
        <nav
          className="mb-4 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground sm:mb-6"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="shrink-0 hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 truncate text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-2">
          <div className="min-w-0">
            <div className="aspect-square overflow-hidden rounded-2xl bg-secondary sm:rounded-3xl">
              {images[activeImage] ? (
                <img
                  src={images[activeImage].url}
                  alt={images[activeImage].altText ?? product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ShoppingBag className="h-14 w-14" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 sm:h-20 sm:w-20 sm:rounded-2xl transition-colors ${
                      index === activeImage ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-2xl font-black font-display leading-tight tracking-tight sm:text-4xl">
              {product.title}
            </h1>

            {discount !== null && (
              <span className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                -{discount}% OFF
              </span>
            )}

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-4">
              <span className="text-3xl font-black font-display text-primary">
                {formatMoney(price.amount, price.currencyCode)}
              </span>
              {showCompare && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatMoney(compareAt.amount, compareAt.currencyCode)}
                </span>
              )}
            </div>

            {product.description && (
              <div className="mt-4 sm:mt-5">
                <p
                  className={`whitespace-pre-line break-words text-base leading-relaxed text-foreground/80 sm:text-sm sm:text-muted-foreground ${
                    showFullDescription ? "" : "line-clamp-8 sm:line-clamp-none"
                  }`}
                >
                  {product.description}
                </p>
                {product.description.length > 220 && (
                  <button
                    onClick={() => setShowFullDescription((v) => !v)}
                    className="mt-2 text-base font-semibold text-primary sm:hidden"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {product.options
              .filter((option) => option.values.length > 1 || option.name.toLowerCase() !== "title")
              .map((option) => {
                const LIMIT = 12;
                const expanded = expandedOptions[option.name] ?? false;
                const selected = selectedValues[option.name];
                let shown = expanded ? option.values : option.values.slice(0, LIMIT);
                if (!expanded && selected && !shown.includes(selected))
                  shown = [...shown.slice(0, LIMIT - 1), selected];
                return (
                  <div key={option.name} className="mt-5 sm:mt-6">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {option.name}
                      {selected && (
                        <span className="ml-1.5 normal-case tracking-normal text-foreground">
                          — {selected}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {shown.map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setSelectedValues((prev) => ({ ...prev, [option.name]: value }))
                          }
                          className={`max-w-full break-words rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                            selectedValues[option.name] === value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "bg-background hover:bg-secondary"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                      {option.values.length > LIMIT && (
                        <button
                          onClick={() =>
                            setExpandedOptions((prev) => ({ ...prev, [option.name]: !expanded }))
                          }
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary sm:text-sm"
                        >
                          {expanded ? "Show less" : `+${option.values.length - LIMIT} more`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

            <div
              ref={actionsRef}
              className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:mt-7 sm:flex sm:flex-wrap"
            >
              <div className="flex items-center rounded-full border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={addToCart}
                disabled={!variant || soldOut || isLoading}
                className="h-11 rounded-full px-7 font-bold"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : soldOut ? (
                  "Sold out"
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                  </>
                )}
              </Button>
              <Button
                onClick={buyNow}
                disabled={!variant || soldOut || isLoading}
                variant="outline"
                className="cta-pulse col-span-2 h-11 rounded-full border-primary px-7 font-bold text-primary"
              >
                Buy Now
              </Button>
            </div>

            <TrustBadges />

            <div className="mt-4 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
              Free US shipping on orders over {formatMoney(50)} • 30-day money-back guarantee •
              Simulated checkout in this demo
            </div>
          </div>
        </div>

        <section className="mt-14 border-t pt-10">
          <h2 className="text-2xl font-black font-display tracking-tight">Reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex" aria-label="No reviews yet">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 text-muted-foreground/40" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to share your take.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pt-3 shadow-elevated backdrop-blur transition-transform duration-300 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden ${
          actionsVisible ? "translate-y-full" : "translate-y-0"
        }`}
        aria-hidden={actionsVisible}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{product.title}</p>
            <p className="text-lg font-black font-display leading-tight text-primary">
              {formatMoney(price.amount, price.currencyCode)}
            </p>
          </div>
          <Button
            onClick={addToCart}
            disabled={!variant || soldOut || isLoading}
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full border-primary text-primary"
            aria-label="Add to cart"
            tabIndex={actionsVisible ? -1 : 0}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={buyNow}
            disabled={!variant || soldOut || isLoading}
            className="h-11 shrink-0 rounded-full px-6 font-bold"
            tabIndex={actionsVisible ? -1 : 0}
          >
            {soldOut ? "Sold out" : "Buy Now"}
          </Button>
        </div>
      </div>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}

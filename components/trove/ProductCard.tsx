import { Link } from "@tanstack/react-router";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { discountPercent, formatMoney, type Product } from "@/lib/catalog";
import { useCaseLine } from "@/lib/editorial";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAdded?: () => void;
}

export function ProductCard({ product, onAdded }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const wishlistIds = useWishlistStore((state) => state.ids);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const variant = product.variants.edges[0]?.node;
  const image = product.images.edges[0]?.node;
  const hoverImage = product.images.edges[1]?.node;
  const discount = discountPercent(product);
  const inWishlist = wishlistIds.includes(product.id);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice;
  const showCompare = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const soldOut =
    product.variants.edges.length > 0 &&
    !product.variants.edges.some((v) => v.node.availableForSale);
  const useCase = useCaseLine(product);

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success("Added to cart", { description: product.title });
    onAdded?.();
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
      <Link
        to="/product/$handle"
        params={{ handle: product.handle }}
        className="block bg-secondary"
        aria-label={`View ${product.title}`}
      >
        <div className="relative aspect-square overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.title}
              loading="lazy"
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${hoverImage ? "sm:group-hover:opacity-0" : ""}`}
            />
          ) : null}
          {image && hoverImage && (
            <img
              src={hoverImage.url}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 hidden h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 sm:block"
            />
          )}
          {!image && (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ShoppingBag className="h-10 w-10" />
            </div>
          )}
          <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3">
            {discount !== null && (
              <span className="rounded-full bg-pop px-2.5 py-1 text-xs font-black text-pop-foreground shadow-card">
                -{discount}% OFF
              </span>
            )}
            {product.tags.some((tag) => tag.toLowerCase().includes("hot")) && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                🔥 HOT
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex flex-col gap-2 sm:right-3 sm:top-3 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-9 w-9 items-center justify-center rounded-full border bg-card shadow-card transition-colors hover:bg-secondary"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>

      <div className="p-3 sm:p-4">
        {useCase && (
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-primary sm:text-[11px]">
            {useCase}
          </p>
        )}
        <Link to="/product/$handle" params={{ handle: product.handle }} className="block">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold sm:text-base">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-black font-display text-primary sm:text-lg">
            {formatMoney(price.amount, price.currencyCode)}
          </span>
          {showCompare && (
            <span className="text-xs text-muted-foreground line-through sm:text-sm">
              {formatMoney(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
        </div>
        <Button
          onClick={handleAdd}
          disabled={!variant || soldOut || isLoading}
          className="shine mt-3 w-full rounded-full font-bold transition-transform active:scale-95"
          size="sm"
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
      </div>
    </div>
  );
}

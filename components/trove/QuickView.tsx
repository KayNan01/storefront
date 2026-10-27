import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Loader2, Minus, Plus, ShoppingBag, Truck } from "lucide-react";

import {
  discountPercent,
  formatMoney,
  FREE_SHIPPING_THRESHOLD,
  type Product,
  type VariantNode,
} from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QuickViewProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product, variant: VariantNode, quantity: number) => void;
}

export function QuickView({ product, open, onClose, onAdd }: QuickViewProps) {
  const isLoading = useCartStore((state) => state.isLoading);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!product) return;
    const defaults: Record<string, string> = {};
    for (const option of product.options) {
      defaults[option.name] = option.values[0] ?? "";
    }
    setSelectedValues(defaults);
    setQuantity(1);
    setActiveImage(0);
  }, [product]);

  const variant = useMemo(() => {
    if (!product) return null;
    return (
      product.variants.edges.find(({ node }) =>
        node.selectedOptions.every(
          (opt) => !selectedValues[opt.name] || selectedValues[opt.name] === opt.value,
        ),
      )?.node ?? product.variants.edges[0]?.node
    );
  }, [product, selectedValues]);

  if (!product) return null;

  const images = product.images.edges.map((edge) => edge.node);
  const discount = discountPercent(product);
  const soldOut =
    product.variants.edges.length > 0 &&
    !product.variants.edges.some((v) => v.node.availableForSale);

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-3xl">
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="min-w-0 bg-secondary p-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-background">
              {images[activeImage] ? (
                <img
                  src={images[activeImage].url}
                  alt={images[activeImage].altText ?? product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ShoppingBag className="h-12 w-12" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      index === activeImage ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0 p-4 sm:p-6">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="break-words pr-6 text-lg font-black font-display sm:text-xl">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {discount !== null && (
              <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                -{discount}% OFF
              </span>
            )}

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black font-display text-primary">
                {formatMoney(
                  variant?.price.amount ?? product.priceRange.minVariantPrice.amount,
                  variant?.price.currencyCode ?? "USD",
                )}
              </span>
              {variant?.compareAtPrice &&
                parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) && (
                  <span className="text-muted-foreground line-through">
                    {formatMoney(
                      variant.compareAtPrice.amount,
                      variant.compareAtPrice.currencyCode,
                    )}
                  </span>
                )}
            </div>

            {product.description && (
              <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                {product.description}
              </p>
            )}

            {product.options
              .filter((option) => option.values.length > 1 || option.name.toLowerCase() !== "title")
              .map((option) => (
                <div key={option.name} className="mt-4">
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {option.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setSelectedValues((prev) => ({ ...prev, [option.name]: value }))
                        }
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          selectedValues[option.name] === value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "bg-background hover:bg-secondary"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center rounded-full border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={() => {
                  if (!variant) return;
                  onAdd(product, variant, quantity);
                  onClose();
                }}
                disabled={!variant || soldOut || isLoading}
                className="flex-1 rounded-full font-bold"
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

            <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-secondary p-4 text-sm">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Free US shipping on orders over{" "}
                {formatMoney(FREE_SHIPPING_THRESHOLD)}
              </p>
              <p className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

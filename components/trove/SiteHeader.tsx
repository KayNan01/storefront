import { useEffect, useState } from "react";
import { Heart, Mail, Search, ShoppingCart, Sparkles, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CATEGORIES = ["All", "Gadgets & Tech", "Beauty & Style", "Smart Home", "TikTok Finds"];

const FILTER_KEYWORDS: Record<string, string[]> = {
  "Gadgets & Tech": ["gadget", "tech", "electronic"],
  "Beauty & Style": ["beauty", "style", "fashion", "skincare"],
  "Smart Home": ["smart-home", "smart", "home"],
  "TikTok Finds": ["tiktok", "viral", "reels", "hot"],
};

export function productMatchesFilter(
  product: { tags: string[]; productType: string },
  filter: string,
): boolean {
  if (filter === "All") return true;
  const keywords = FILTER_KEYWORDS[filter];
  if (!keywords) return true;
  const haystack = [...product.tags, product.productType].join(" ").toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

interface SiteHeaderProps {
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  onOpenCart: () => void;
  compact?: boolean;
}

export function SiteHeader({
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
  onOpenCart,
  compact,
}: SiteHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const wishlistIds = useWishlistStore((state) => state.ids);

  useEffect(() => setMounted(true), []);

  const totalItems = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlistIds.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
          <a href="/" className="shrink-0 text-2xl font-black font-display tracking-tight">
            Trove<span className="text-primary">.</span>
          </a>

          {!compact && (
            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="What's trending today?"
                className="rounded-full bg-secondary pl-9"
                aria-label="Search products"
              />
            </div>
          )}

          <div className="flex shrink-0 items-center sm:gap-1">
            <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
              <a
                href="mailto:support@trove.example"
                aria-label="Email support@trove.example"
                title="support@trove.example"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1.5 px-2.5 text-primary sm:px-3"
            >
              <Link to="/finder" aria-label="AI product finder">
                <Sparkles className="h-4 w-4" />
                <span className="hidden md:inline">Find for me</span>
              </Link>
            </Button>
            {!compact && (
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label="Search products"
                onClick={() =>
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button asChild variant="ghost" size="icon">
              <Link to="/account" aria-label="My account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className="relative"
              onClick={() =>
                toast(`${wishlistCount} item${wishlistCount === 1 ? "" : "s"} in your wishlist`)
              }
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              className="relative"
              onClick={onOpenCart}
            >
              <ShoppingCart
                key={`cart-${totalItems}`}
                className={`h-5 w-5 ${totalItems > 0 ? "cart-bump" : ""}`}
              />
              {totalItems > 0 && (
                <span
                  key={`n-${totalItems}`}
                  className="pop-in absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {!compact && (
          <nav className="flex gap-1 overflow-x-auto pb-3" aria-label="Categories">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onFilterChange?.(category);
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { productsQueryOptions, type Product, type VariantNode } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { TopBar } from "@/components/trove/TopBar";
import { SiteHeader } from "@/components/trove/SiteHeader";
import { Hero } from "@/components/trove/Hero";
import { ProductMarquee } from "@/components/trove/ProductMarquee";
import { ProductGrid } from "@/components/trove/ProductGrid";
import { WhyTrove } from "@/components/trove/WhyTrove";
import { CategoryTiles } from "@/components/trove/CategoryTiles";
import { PromoBand } from "@/components/trove/PromoBand";
import { CuratorNote } from "@/components/trove/CuratorNote";
import { SiteFooter } from "@/components/trove/SiteFooter";
import { QuickView } from "@/components/trove/QuickView";
import { CartDrawer } from "@/components/trove/CartDrawer";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  head: () => ({
    meta: [
      { title: "Trove — Trending Products, Gadgets & Viral Finds" },
      {
        name: "description",
        content:
          "Shop Trove for the internet's most-wanted gadgets, style finds and smart-home picks. Free US shipping over $50 and a 30-day guarantee on every order.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Trove — Trending Products, Gadgets & Viral Finds" },
      {
        property: "og:description",
        content:
          "The internet's most-wanted finds, hand-picked and delivered to your door. Free US shipping over $50.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Trove — Trending Products, Gadgets & Viral Finds" },
      {
        name: "twitter:description",
        content:
          "The internet's most-wanted finds, hand-picked and delivered to your door. Free US shipping over $50.",
      },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const addItem = useCartStore((state) => state.addItem);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAdd = async (product: Product, variant: VariantNode, quantity: number) => {
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

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SiteHeader
        activeFilter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        onOpenCart={() => setCartOpen(true)}
      />
      <main className="flex-1">
        <Hero products={products} />
        <ProductMarquee products={products} />
        <CategoryTiles onPick={setFilter} />
        <ProductGrid
          products={products}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onQuickView={setQuickViewProduct}
          onAdded={() => setCartOpen(true)}
        />
        <PromoBand />
        <CuratorNote />
        <WhyTrove />
      </main>
      <SiteFooter />
      <QuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAdd={handleAdd}
      />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}

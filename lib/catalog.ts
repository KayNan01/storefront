import { queryOptions } from "@tanstack/react-query";

import mockData from "@/data/mockData.json";

// ============ Store rules ============
/** Free US shipping applies to cart subtotals at or above this amount (USD). */
export const FREE_SHIPPING_THRESHOLD = 50;
/** Flat shipping fee charged below the free-shipping threshold (USD). */
export const FLAT_SHIPPING_RATE = 4.99;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
}

// ============ Types ============
export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ImageNode {
  url: string;
  altText: string | null;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface VariantNode {
  id: string;
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  tags: string[];
  productType: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money } | null;
  images: { edges: { node: ImageNode }[] };
  variants: { edges: { node: VariantNode }[] };
  options: ProductOption[];
}

export interface CartItem {
  product: Product;
  variantId: string;
  variantTitle: string;
  price: Money;
  quantity: number;
  selectedOptions: SelectedOption[];
}

// ============ Mock catalog (src/data/mockData.json) ============
// The portfolio build reads a local, fictional catalog instead of a commerce API.
// Swap these two functions for real API calls to connect a live backend.
const PRODUCTS = mockData.products as Product[];

export async function getCatalog(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getCatalogProduct(handle: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => getCatalog(),
  });

export const productQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: () => getCatalogProduct(handle),
  });

// ============ Formatting helpers ============
export function formatMoney(amount: string | number, currencyCode = "USD"): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(
      value,
    );
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function discountPercent(product: Product): number | null {
  const compare = product.compareAtPriceRange?.minVariantPrice?.amount;
  const price = product.priceRange?.minVariantPrice?.amount;
  if (!compare || !price) return null;
  const compareNum = parseFloat(compare);
  const priceNum = parseFloat(price);
  if (!compareNum || compareNum <= priceNum) return null;
  return Math.round(((compareNum - priceNum) / compareNum) * 100);
}

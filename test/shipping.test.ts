import { describe, expect, it } from "vitest";

import { FLAT_SHIPPING_RATE, shippingFor } from "@/lib/catalog";
import { buildOrder } from "@/stores/demoStore";
import mockData from "@/data/mockData.json";
import type { CartItem, Product } from "@/lib/catalog";

const product = mockData.products[0] as Product;
const variant = product.variants.edges[0]!.node;
const line = (quantity: number, amount: string): CartItem => ({
  product,
  variantId: variant.id,
  variantTitle: variant.title,
  price: { amount, currencyCode: "USD" },
  quantity,
  selectedOptions: variant.selectedOptions,
});
const address = {
  name: "A",
  line1: "1 Example St",
  line2: "",
  city: "Austin",
  state: "TX",
  postal_code: "73301",
};

describe("Shipping rule", () => {
  it("charges $4.99 below $50", () => {
    expect(FLAT_SHIPPING_RATE).toBe(4.99);
    expect(shippingFor(49.99)).toBe(4.99);
  });
  it("is free at exactly $50 and above", () => {
    expect(shippingFor(50)).toBe(0);
    expect(shippingFor(120)).toBe(0);
  });
  it("adds shipping to a demo order total", () => {
    const order = buildOrder({ email: "a@example.com", items: [line(1, "24.99")], address }, 1);
    expect(order.shipping).toBe(4.99);
    expect(order.total).toBe(29.98);
  });
});

describe("Mock data", () => {
  it("only uses reserved example email domains for people", () => {
    expect(mockData.customer.email.endsWith("@example.com")).toBe(true);
  });
  it("gives every product at least one image and variant", () => {
    for (const p of mockData.products) {
      expect(p.images.edges.length).toBeGreaterThan(0);
      expect(p.variants.edges.length).toBeGreaterThan(0);
    }
  });
});

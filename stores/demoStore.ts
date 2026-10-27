import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CartItem } from "@/lib/catalog";
import { shippingFor } from "@/lib/catalog";

// Simulated customer session and orders. Nothing leaves the browser:
// no real accounts, payments or emails exist in the portfolio build.

export interface DemoUser {
  id: string;
  name: string;
  email: string;
}

export interface DemoAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface DemoProfile extends DemoAddress {
  phone: string;
}

export interface DemoOrder {
  id: string;
  number: string;
  createdAt: string;
  email: string;
  items: { title: string; variant: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  shippingAddress: DemoAddress;
}

interface DemoStore {
  user: DemoUser | null;
  profile: DemoProfile | null;
  orders: DemoOrder[];
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  saveProfile: (profile: DemoProfile) => void;
  placeOrder: (input: { email: string; items: CartItem[]; address: DemoAddress }) => DemoOrder;
}

export function buildOrder(
  input: { email: string; items: CartItem[]; address: DemoAddress },
  seq: number,
): DemoOrder {
  const items = input.items.map((i) => ({
    title: i.product.title,
    variant: i.variantTitle,
    quantity: i.quantity,
    unitPrice: parseFloat(i.price.amount),
  }));
  const subtotal = Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100;
  const shipping = shippingFor(subtotal);
  return {
    id: `demo_${Date.now().toString(36)}`,
    number: `#TR-${9000 + seq}`,
    createdAt: new Date().toISOString(),
    email: input.email,
    items,
    subtotal,
    shipping,
    total: Math.round((subtotal + shipping) * 100) / 100,
    status: "processing",
    shippingAddress: input.address,
  };
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      orders: [],
      signIn: (email, name) => {
        const clean = email.trim().toLowerCase();
        set({
          user: {
            id: `demo_${clean}`,
            email: clean,
            name: name?.trim() || clean.split("@")[0] || "Guest",
          },
        });
      },
      signOut: () => set({ user: null }),
      saveProfile: (profile) => set({ profile }),
      placeOrder: (input) => {
        const order = buildOrder(input, get().orders.length + 1);
        set({ orders: [order, ...get().orders] });
        return order;
      },
    }),
    { name: "trove-demo-session", storage: createJSONStorage(() => localStorage) },
  ),
);

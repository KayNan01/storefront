import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  toggle: (productId: string) => void;
}

// Favorites are stored only in this browser (localStorage) in the portfolio build.
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const { ids } = get();
        set({
          ids: ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
        });
      },
    }),
    {
      name: "trove-demo-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

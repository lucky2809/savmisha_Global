// src/store/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clampQty, MAX_ORDER_QTY } from "../lib/catalog";

/**
 * The cart lives entirely in the browser. The previous version called
 * /cart endpoints that were never implemented on the backend, so every
 * call failed silently. Only the finished order is sent to the server.
 *
 * A line is one product in one size and one colour, matching how the
 * backend models an order item.
 */
const lineKey = (productId, size, color) => `${productId}::${size}::${color}`;

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** Adding the same product/size/colour again tops up the existing line. */
      addItem: ({ productId, serialNumber, description, image, size, color, quantity }) => {
        const key = lineKey(productId, size, color);
        const qty = clampQty(quantity);

        const existing = get().items.find((i) => i.key === key);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: clampQty(i.quantity + qty) } : i
            ),
          });
          return {
            merged: true,
            capped: existing.quantity + qty > MAX_ORDER_QTY,
          };
        }

        set({
          items: [
            ...get().items,
            { key, productId, serialNumber, description, image, size, color, quantity: qty },
          ],
        });

        return { merged: false, capped: false };
      },

      setQuantity: (key, quantity) =>
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity: clampQty(quantity) } : i
          ),
        }),

      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),

      clear: () => set({ items: [] }),

      totalUnits: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      lineCount: () => get().items.length,
    }),
    {
      name: "cart-storage",
      version: 2,
      // v1 stored { addCart: [...] } with a different line shape and a price
      // field. Nothing there maps cleanly onto size/colour lines, so it is
      // dropped rather than half-migrated into an unorderable cart.
      migrate: () => ({ items: [] }),
    }
  )
);

export default useCartStore;

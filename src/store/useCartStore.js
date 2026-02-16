// src/store/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useCartStore = create(
  persist(
    (set, get) => ({

      addCart: [],

      // Load from backend
      loadCartFromBackend: async () => {
        try {
          const token = localStorage.getItem("access_token");
          console.log(token)
          const res = await axios.get(
            `${import.meta.env.VITE_BACK_END_URL}/cart`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set({ addCart: res.data.data || [] });
        } catch (err) {
          console.log("Load Cart Error:", err);
        }
      },

      // Add item (Backend + Zustand)
      addItem: async (item) => {
        try {
          const token = localStorage.getItem("access_token");
          console.log("TOKEN SENT:", token);

          const res = await axios.post(
            `${import.meta.env.VITE_BACK_END_URL}/cart/add`,
            {
              productId: item.id,
              productName: item.name,
              image: item.image,
              price: item.price,
              quantity: 1,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set((state) => ({
            addCart: [...state.addCart, res.data.cartItem],
          }));
        } catch (err) {
          console.log("Add Item Error:", err.response?.data || err);
        }
      },


      // Remove item
      removeItem: async (id) => {
        try {
          const token = localStorage.getItem("access_token");

          await axios.delete(
            `${import.meta.env.VITE_BACK_END_URL}/cart/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set((state) => ({
            addCart: state.addCart.filter((item) => item._id !== id),
          }));
        } catch (err) {
          console.log("Delete Cart Item:", err);
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          const token = localStorage.getItem("access_token");

          await axios.delete(
            `${import.meta.env.VITE_BACK_END_URL}/cart`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set({ addCart: [] });
        } catch (err) {
          console.log("Clear Cart Error:", err);
        }
      },

    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;

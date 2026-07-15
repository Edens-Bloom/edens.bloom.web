"use client";

import { create } from "zustand";
import { produce } from "immer";
import { authService } from "@/services/authService";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import type {
  BloomState,
  CartState,
  Product,
  SelectedProduct,
  User,
  Order,
} from "@/types";

const initializeCart = (): CartState => ({
  items: [],
  subTotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  shippingFee: 0,
  totalAmount: 0,
});

const isBrowser = typeof window !== "undefined";

const loadJson = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveJson = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getInitialCart = (): CartState =>
  loadJson("bloom_cart", initializeCart());

interface CreateProductPayload extends Partial<Product> {}

export const useStore = create<BloomState>((set, get) => ({
  products: [],
  cart: getInitialCart(),
  wishlist: loadJson<number[]>("bloom_wishlist", []),
  user: loadJson<User | null>("bloom_user", null),
  token: isBrowser ? window.localStorage.getItem("bloom_token") : null,
  isLoading: false,
  error: null,
  selectedProduct: null,
  loading: { fetchById: false },
  orders: [],

  setSelectedProduct: (product) =>
    set(
      produce((state: BloomState) => {
        state.selectedProduct = product;
      }),
    ),

  fetchProducts: async () => {
    set(
      produce((state: BloomState) => {
        state.isLoading = true;
        state.error = null;
      }),
    );

    try {
      const products = await productService.fetchAll();
      set(
        produce((state: BloomState) => {
          state.products = products;
          state.isLoading = false;
        }),
      );
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error =
            error instanceof Error ? error.message : "Failed to fetch products";
          state.isLoading = false;
        }),
      );
    }
  },

  fetchProductById: async (id, isSelected = false) => {
    const existing = get().products.find((product) => product.id === id);
    if (existing && isSelected) {
      set(
        produce((state: BloomState) => {
          state.selectedProduct = {
            ...existing,
            selectedAddOnId: null,
            selectedAddOnPrice: 0,
            selectedImageUrl: existing.imageUrl || "",
            quantity: 1,
            subTotal: existing.price,
          };
        }),
      );
      return;
    }

    set(
      produce((state: BloomState) => {
        state.loading.fetchById = true;
        state.error = null;
      }),
    );

    try {
      const product = await productService.fetchById(id);
      set(
        produce((state: BloomState) => {
          const index = state.products.findIndex((item) => item.id === id);
          if (index !== -1) state.products[index] = product;
          state.selectedProduct = isSelected
            ? {
                ...product,
                selectedAddOnId: null,
                selectedAddOnPrice: 0,
                selectedImageUrl: product.imageUrl || "",
                quantity: 1,
                subTotal: product.price,
              }
            : state.selectedProduct;
          state.loading.fetchById = false;
        }),
      );
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error =
            error instanceof Error ? error.message : "Failed to fetch product";
          state.loading.fetchById = false;
        }),
      );
    }
  },

  addToCart: (product) => {
    set(
      produce((state: BloomState) => {
        const index = state.cart.items.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedAddOnId === product.selectedAddOnId,
        );
        if (index !== -1) {
          state.cart.items[index].quantity += product.quantity;
        } else {
          state.cart.items.push(product);
        }
        updateCartTotals(state.cart);
        saveJson("bloom_cart", state.cart);
      }),
    );
  },

  removeFromCart: (item) => {
    set(
      produce((state: BloomState) => {
        state.cart.items = state.cart.items.filter(
          (current) =>
            !(
              current.id === item.id &&
              current.selectedAddOnId === item.selectedAddOnId
            ),
        );
        updateCartTotals(state.cart);
        saveJson("bloom_cart", state.cart);
      }),
    );
  },

  updateCart: (item) => {
    set(
      produce((state: BloomState) => {
        const index = state.cart.items.findIndex(
          (current) =>
            current.id === item.id &&
            current.selectedAddOnId === item.selectedAddOnId,
        );
        if (index !== -1) {
          state.cart.items[index] = item;
        }
        updateCartTotals(state.cart);
        saveJson("bloom_cart", state.cart);
      }),
    );
  },

  clearCart: () => {
    const cart = initializeCart();
    saveJson("bloom_cart", cart);
    set(
      produce((state: BloomState) => {
        state.cart = cart;
      }),
    );
  },

  toggleWishlist: (productId: number) => {
    set(
      produce((state: BloomState) => {
        const index = state.wishlist.indexOf(productId);
        if (index >= 0) state.wishlist.splice(index, 1);
        else state.wishlist.push(productId);
        saveJson("bloom_wishlist", state.wishlist);
      }),
    );
  },

  getCartTotal: () => {
    return get().cart.totalAmount;
  },

  getCartCount: () => {
    return get().cart.items.reduce((count, item) => count + item.quantity, 0);
  },

  login: async (username, password) => {
    set(
      produce((state: BloomState) => {
        state.isLoading = true;
        state.error = null;
      }),
    );
    try {
      const { token, user } = await authService.login(username, password);
      saveJson("bloom_user", user);
      window.localStorage.setItem("bloom_token", token);
      set(
        produce((state: BloomState) => {
          state.user = user;
          state.token = token;
          state.isLoading = false;
        }),
      );
      return true;
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error = error instanceof Error ? error.message : "Login failed";
          state.isLoading = false;
        }),
      );
      return false;
    }
  },

  logout: () => {
    if (isBrowser) {
      window.localStorage.removeItem("bloom_token");
      window.localStorage.removeItem("bloom_user");
    }
    set(
      produce((state: BloomState) => {
        state.user = null;
        state.token = null;
      }),
    );
  },

  fetchOrders: async () => {
    set(
      produce((state: BloomState) => {
        state.isLoading = true;
        state.error = null;
      }),
    );
    try {
      const orders = await orderService.fetchAllOrders();
      set(
        produce((state: BloomState) => {
          state.orders = orders;
          state.isLoading = false;
        }),
      );
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error =
            error instanceof Error ? error.message : "Failed to fetch orders";
          state.isLoading = false;
        }),
      );
    }
  },

  onConfirm: async () => {
    const state = get();
    if (!state.user || !state.user.phoneNumber) {
      throw new Error(
        "Please log in and provide a phone number before confirming the order.",
      );
    }
    const order = await orderService.orderConfirm(state.user, state.cart);
    set(
      produce((draft: BloomState) => {
        draft.orders.unshift(order);
        draft.cart = initializeCart();
      }),
    );
    saveJson("bloom_cart", initializeCart());
    return order;
  },
}));

const updateCartTotals = (cart: CartState) => {
  cart.subTotal = cart.items.reduce(
    (sum, item) => sum + (item.subTotal || 0),
    0,
  );
  cart.totalAmount =
    cart.subTotal + cart.taxAmount + cart.shippingFee - cart.discountAmount;
};

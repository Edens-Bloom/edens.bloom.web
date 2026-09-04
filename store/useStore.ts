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
  // Order (unused)
} from "@/types";

const initializeCart = (): CartState => ({
  items: [],
  subTotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  shippingFee: 0,
  totalAmount: 0,
});

const loadJson = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getInitialCart = (): CartState => initializeCart();

// interface CreateProductPayload extends Partial<Product> {}

export const useStore = create<BloomState>((set, get) => ({
  products: [],
  cart: getInitialCart(),
  wishlist: [] as number[],
  user: null,
  token: null,
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

  updateSelectedProduct: (product) =>
    set(
      produce((state: BloomState) => {
        if (!product) {
          state.selectedProduct = null;
          return;
        }

        state.selectedProduct = state.selectedProduct
          ? { ...state.selectedProduct, ...product }
          : (product as SelectedProduct);
      }),
    ),

  updateUser: (updatedFields) =>
    set(
      produce((state: BloomState) => {
        if (state.user) {
          state.user = { ...state.user, ...updatedFields };
          saveJson("bloom_user", state.user);
        }
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

  addProduct: async (product) => {
    set(
      produce((state: BloomState) => {
        state.isLoading = true;
        state.error = null;
      }),
    );

    try {
      const created = await productService.create(product as Partial<Product>);
      set(
        produce((state: BloomState) => {
          state.products = [created, ...state.products];
          state.isLoading = false;
        }),
      );
      return true;
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error =
            error instanceof Error ? error.message : "Failed to create product";
          state.isLoading = false;
        }),
      );
      return false;
    }
  },

  updateProduct: async (id, product) => {
    set(
      produce((state: BloomState) => {
        state.isLoading = true;
        state.error = null;
      }),
    );

    try {
      const updated = await productService.update(
        id,
        product as Partial<Product>,
      );
      set(
        produce((state: BloomState) => {
          const index = state.products.findIndex((item) => item.id === id);
          if (index !== -1) {
            state.products[index] = { ...state.products[index], ...updated };
          }
          state.isLoading = false;
        }),
      );
      return true;
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error =
            error instanceof Error ? error.message : "Failed to update product";
          state.isLoading = false;
        }),
      );
      return false;
    }
  },

  deleteProduct: async (id) => {
    set(
      produce((state: BloomState) => {
        state.isLoading = true;
        state.error = null;
      }),
    );

    try {
      await productService.delete(id);
      set(
        produce((state: BloomState) => {
          state.products = state.products.filter(
            (product) => product.id !== id,
          );
          state.isLoading = false;
        }),
      );
      return true;
    } catch (error) {
      set(
        produce((state: BloomState) => {
          state.error =
            error instanceof Error ? error.message : "Failed to delete product";
          state.isLoading = false;
        }),
      );
      return false;
    }
  },

  fetchProductById: async (id, isSelected = false) => {
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

  // Load persisted data from localStorage. Call from a client-side effect
  // after the first render to avoid hydration mismatches.
  rehydrate: () => {
    set(
      produce((state: BloomState) => {
        state.cart = loadJson<CartState>("bloom_cart", initializeCart());
        state.wishlist = loadJson<number[]>("bloom_wishlist", []);
        state.user = loadJson<User | null>("bloom_user", null);
        state.token = loadJson<string | null>("bloom_token", null);
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
    window.localStorage.removeItem("bloom_token");
    window.localStorage.removeItem("bloom_user");
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

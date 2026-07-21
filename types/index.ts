export interface AddOn {
  id: number;
  label: string;
  price: number;
  is_default?: boolean;
  image_url?: string;
  imageUrl?: string;
}

export interface DBAddOns {
  id: number;
  product_id: number;
  label: string;
  price: number;
  is_default: boolean;
  sort_order: number;
  is_active: boolean;
  is_deleted: boolean;
  image_url: string;
}

export interface DProduct {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  category: string;
  product_type?: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  icon: string;
  created_at?: Date;
  updated_at?: Date;
  add_ons?: DBAddOns[];
  image_url?: string;
  in_stock?: boolean;
  product_number?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  old_price?: number;
  category: string;
  productType?: string;
  product_type?: string;
  imageUrl?: string;
  image_url?: string;
  badge?: string;
  rating: number;
  reviews?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  productNumber?: string;
  addOns?: AddOn[];
  add_ons?: AddOn[];
  inStock?: boolean;
}

export interface SelectedProduct extends Product {
  selectedAddOnId: number | null;
  selectedAddOnPrice: number;
  selectedImageUrl: string;
  subTotal: number;
  quantity: number;
}

export interface CartState {
  items: SelectedProduct[];
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  name?: string;
  phoneNumber?: string;
  address?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  addon_id: number | null;
  buy_quantity: number;
  free_quantity: number;
  total_quantity: number;
  price_at_order: number;
  addon_price_at_order: number;
  subtotal: number;
  product_name: string;
  image_url?: string;
  addon_label?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  created_at: string;
  customer_id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  items?: OrderItem[];
}

export interface BloomState {
  products: Product[];
  cart: CartState;
  wishlist: number[];
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  selectedProduct: SelectedProduct | null;
  loading: { fetchById: boolean };
  orders: Order[];
  updateUser: (user: Partial<User>) => void;
  setSelectedProduct: (product: SelectedProduct | null) => void;
  updateSelectedProduct: (product: Partial<SelectedProduct> | null) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Partial<Product> | FormData) => Promise<boolean>;
  updateProduct: (
    id: number,
    product: Partial<Product> | FormData,
  ) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  addToCart: (product: SelectedProduct) => void;
  removeFromCart: (item: SelectedProduct) => void;
  updateCart: (product: SelectedProduct) => void;
  clearCart: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchOrders: () => Promise<void>;
  onConfirm: () => Promise<Order>;
  fetchProductById: (id: number, isSelected?: boolean) => Promise<void>;
  getCartCount: () => number;
  rehydrate: () => void;
}

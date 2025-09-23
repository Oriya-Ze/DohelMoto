export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  is_google_user: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  category_id?: string;
  image_urls: string[];
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product: Product;
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: Address;
  billing_address: Address;
  created_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_from_ai: boolean;
  session_id?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface GoogleAuthResponse {
  token: string;
}

export interface PaymentIntent {
  client_secret: string;
  payment_intent_id: string;
}

export interface FileUpload {
  url: string;
  filename: string;
  size: number;
}


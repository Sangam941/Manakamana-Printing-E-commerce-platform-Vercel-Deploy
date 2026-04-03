export interface User {
  id: string;
  userId: string;
  client_code?: string;
  role?: string;
  business_name: string;
  owner_name?: string;
  phone_number: string;
  email: string;
  address: string;
  createdAt?: string;
  notes?: string;
  wallet_balance?: number;
  user?: user
}

export interface user {
  clientId: string;
  role: string;
  createdAt?: string;
}



export type OrderStatus =
  | "ORDER_PLACED"
  | "ORDER_ACCEPTED"
  | "ORDER_PROCESSING"
  | "ORDER_DISPATCHED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED";

export interface Order {
  id: string;
  orderName: string;
  service: string;
  quantity: number;
  paperType: string;
  finishingOption: string;
  designId?: string;
  orderType: "STANDARD" | "CUSTOM";
  status: OrderStatus;
  date: string;
}

export interface Service {
  id: string;
  name: string;
  route?: string;
  description?: string;
  basePrice?: number;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
}


export interface DashboardStats {
  totalOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  availableTemplates: number;
}

// ─── Order Form / Product Types ──────────────────────────────────────────────

export type FieldDef =
  | { type: "number"; id: string; label: string; min: number; icon: string; hint?: string }
  | { type: "select"; id: string; label: string; options: { value: string; label: string }[]; icon: string; hint?: string }
  | { type: "text"; id: string; label: string; icon: string; placeholder?: string; hint?: string };

export type ProductDef = {
  id: string;
  categoryId: string;
  name: string;
  images: string[];
  fields: FieldDef[];
  calculatePrice: (state: Record<string, string>) => { applicableCost: number; discount: number };
  getActiveImageIndex?: (state: Record<string, string>) => number;
  emailExtraCharge: number;
  freeDeliveryThreshold: number;
  renderProductInfo: () => React.ReactNode;
};

// ─── Backend Product Types ───────────────────────────────────────────────────

export type ProductType = "ID_CARD" | "CARD_HOLDER" | "BILL_BOOK" | "PAMPHLET";

export interface PricingDetails {
  quantity: number;
  printing_side: "single" | "double";
  base_unit_price: number;
  discount_type: string | null;
  discount_value: number;
  discount_amount_per_unit: number;
  total_discount_amount: number;
  final_unit_price: number;
  total_amount: number;
  final_amount: number;
}

export interface BackendProduct {
  id: string;
  product_type: ProductType;
  product_code: string;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  base_price: number;
  discount_type: string | null;
  discount_value: number;
  pricing: PricingDetails;
  created_at?: string;
  updated_at?: string;
}

export interface ProductConfig {
  type: ProductType;
  fields: FieldDef[];
  calculatePrice: (product: BackendProduct, state: Record<string, string>) => { applicableCost: number; discount: number };
  renderInfo: (product: BackendProduct) => React.ReactNode;
}
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ORDER" | "WALLET" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

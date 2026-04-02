
// Utility types

import api from "./axios";

export type IDCardPricing = {
  quantity: number;
  printing_side: string;
  base_unit_price: number;
  discount_type: "fixed" | "percentage" | null;
  discount_value: number;
  discount_amount_per_unit: number;
  total_discount_amount: number;
  final_unit_price: number;
  total_amount: number;
  final_amount: number;
};

export type IDCardProduct = {
  id: string;
  product_type: "ID_CARD";
  product_code: string;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  base_price: number;
  discount_type: "fixed" | "percentage" | null;
  discount_value: number;
  pricing: IDCardPricing;
  created_at: string;
  updated_at: string;
};

export type IDCardPriceRequest = {
  // Fields required for price calculation, e.g. dynamicFields, quantity, printing_side, etc.
  // Extend as needed per API spec
  [key: string]: any;
};

export type IDCardPriceResponse = {
  quantity: number;
  printing_side: string;
  base_unit_price: number;
  discount_type: "fixed" | "percentage" | null;
  discount_value: number;
  discount_amount_per_unit: number;
  total_discount_amount: number;
  final_unit_price: number;
  total_amount: number;
  final_amount: number;
};


export async function fetchIDCardProducts(): Promise<IDCardProduct[]> {
  try {
    const response = await api.get("/v1/idcards/products");
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch ID Card products");
  }
}


export async function fetchIDCardProductById(
  idcardProductId: string
): Promise<IDCardProduct> {
  try {
    const response = await api.get(`/v1/idcard/products/${idcardProductId}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch ID Card product");
  }
}


export async function calculateIDCardPrice(
  idcardProductId: string,
  quantity:number,
): Promise<IDCardPriceResponse> {
  try {
    const response = await api.post(
      `/v1/idcard/products/${idcardProductId}/price`,
      {quantity}
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to calculate ID Card price");
  }
}


//order for ID Card
export interface CreateIDCardOrderRequest {
  idcardProductId: string;
  quantity: number;
  printing_side: "single" | "double";
  orientation: "portrait" | "landscape";
  strap_color: string;
  strap_text: string;
  notes?: string;
}

export interface IDCardOrderPricingSnapshot {
  quantity: number;
  order_type: string;
  strap_text: string;
  orientation: string;
  strap_color: string;
  final_amount: number;
  product_code: string;
  product_name: string;
  total_amount: number;
  discount_type: "fixed" | "percentage" | null;
  printing_side: "single" | "double";
  discount_value: number;
  base_unit_price: number;
  final_unit_price: number;
  idcard_product_id: string;
  total_discount_amount: number;
  discount_amount_per_unit: number;
}

export interface IDCardProductForOrder {
  id: string;
  product_code: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  discount_type: "fixed" | "percentage" | null;
  discount_value: number;
  pricing: {
    quantity: number;
    printing_side: "single" | "double";
    base_unit_price: number;
    discount_type: "fixed" | "percentage" | null;
    discount_value: number;
    discount_amount_per_unit: number;
    total_discount_amount: number;
    final_unit_price: number;
    total_amount: number;
    final_amount: number;
  };
}

export interface IDCardDetail {
  id: string;
  printing_side: "single" | "double";
  orientation: "portrait" | "landscape";
  strap_color: string;
  strap_text: string;
}

export interface CreateIDCardOrderResponseData {
  id: string;
  order_type: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_type: "fixed" | "percentage" | null;
  discount_value: number;
  discount_amount: number;
  final_amount: number;
  status: string;
  payment_status: string;
  notes: string | null;
  pricing_snapshot: IDCardOrderPricingSnapshot;
  created_at: string;
  updated_at: string;
  approved_design: any; // Could be null or an object, type as needed
  wallet_transaction: any; // Could be null or an object, type as needed
  idcard_product: IDCardProductForOrder;
  idcard_detail: IDCardDetail;
}

export interface CreateIDCardOrderResponse {
  success: boolean;
  message: string;
  data: CreateIDCardOrderResponseData;
}

export async function createIDCardOrder(
  orderData: CreateIDCardOrderRequest
): Promise<CreateIDCardOrderResponse> {
  try {
    const response = await api.post("/v1/idcards/orders", orderData);
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to create ID Card order");
  }
}

export interface IDCardOrder {
  id: string;
  order_type: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_type: "fixed" | "percentage" | null;
  discount_value: number;
  discount_amount: number;
  final_amount: number;
  status: string;
  payment_status: string;
  notes: string | null;
  pricing_snapshot: IDCardOrderPricingSnapshot;
  created_at: string;
  updated_at: string;
  approved_design: any; // Could be null or an object, type as needed
  wallet_transaction: any; // Could be null or an object, type as needed
  idcard_product: IDCardProductForOrder;
  idcard_detail: IDCardDetail;
}

export interface GetIDCardOrdersResponse {
  success: boolean;
  message: string;
  data: IDCardOrder[];
}

// Fetch all orders of the current user
export async function fetchAllOrders(): Promise<GetIDCardOrdersResponse> {
  try {
    const response = await api.get("/v1/orders");
    console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch ID Card orders");
  }
}
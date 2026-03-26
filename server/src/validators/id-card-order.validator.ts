import { z } from "zod";

// --- CATEGORY VALIDATORS ---

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// --- PRODUCT VALIDATORS ---

export const createProductSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  code: z.string().min(2, "Product code must be at least 2 characters"),
  basePrice: z.number().positive("Base price must be positive"),
  minQty: z.number().int().min(1, "Minimum quantity must be at least 1").default(1),
  previewImageUrl: z.string().url("Invalid preview image URL").optional().or(z.literal("")),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  
  // Discount fields
  discountPercent: z.number().min(0).max(100).optional().default(0),
  discountAmount: z.number().min(0).optional().default(0),
});

export const updateProductSchema = createProductSchema.partial();

// --- ID CARD ORDER VALIDATORS ---

export const createIdCardOrderSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  orderName: z.string().min(2, "Order name must be at least 2 characters"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  printingSide: z.enum(["single", "double"]),
  photosLink: z.string().url("Invalid photos link URL"),
  orientation: z.enum(["landscape", "portrait"]),
  stripeColor: z.string().optional().or(z.literal("")),
  stripeText: z.string().optional().or(z.literal("")),
  remark: z.string().optional().or(z.literal("")),
  payFromWallet: z.boolean().optional().default(false),
});

export const updateIdCardOrderStatusSchema = z.object({
  status: z.enum([
    "pending_payment",
    "confirmed",
    "in_progress",
    "printed",
    "completed",
    "cancelled",
  ]),
});

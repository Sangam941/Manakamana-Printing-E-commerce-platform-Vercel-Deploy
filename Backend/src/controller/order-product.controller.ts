import { Request, Response } from "express";
import * as productService from "../services/order-product.service";

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const activeOnly = (req as any).user?.role === "CLIENT" || !req.headers.authorization;
    const products = await productService.getProductsByCategoryService(categoryId as string, activeOnly);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductByIdService(productId as string);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProductsAdminService();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProductService(req.body);
    res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await productService.updateProductService(productId as string, req.body);
    res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

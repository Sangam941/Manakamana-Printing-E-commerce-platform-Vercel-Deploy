import { Request, Response } from "express";
import * as adminProductService from "../services/admin-product.service";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await adminProductService.createProductService(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await adminProductService.getAllProductsService();
    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVariant = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const variant = await adminProductService.createVariantService(productId as string, req.body);
    res.status(201).json({ success: true, data: variant });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOptionGroup = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const group = await adminProductService.createOptionGroupService(variantId as string, req.body);
    res.status(201).json({ success: true, data: group });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOptionValue = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const value = await adminProductService.createOptionValueService(groupId as string, req.body);
    res.status(201).json({ success: true, data: value });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVariantPricing = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const pricing = await adminProductService.createVariantPricingService(variantId as string, req.body);
    res.status(201).json({ success: true, data: pricing });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVariantFullDetails = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const details = await adminProductService.getVariantDetailsWithPricingInfo(variantId as string);
    if (!details) return res.status(404).json({ success: false, message: "Variant not found" });
    res.status(200).json({ success: true, data: details });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

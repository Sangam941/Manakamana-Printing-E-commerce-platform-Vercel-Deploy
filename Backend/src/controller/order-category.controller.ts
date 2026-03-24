import { Request, Response } from "express";
import * as categoryService from "../services/order-category.service";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const activeOnly = (req as any).user?.role === "CLIENT" || !req.headers.authorization;
    const categories = await categoryService.getAllCategoriesService(activeOnly);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await categoryService.getCategoryByIdService(categoryId as string);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategoryService(req.body);
    res.status(201).json({ success: true, message: "Category created successfully", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await categoryService.updateCategoryService(categoryId as string, req.body);
    res.status(200).json({ success: true, message: "Category updated successfully", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

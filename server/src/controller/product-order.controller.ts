import { Request, Response } from "express";
import * as orderService from "../services/product-order.service";

export const createProductOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const order = await orderService.createProductOrderService({
      userId,
      ...req.body
    });
    res.status(201).json({ success: true, message: "Order placed successfully", data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderService.getClientOrdersService(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderDetailsService(orderId as string);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatusService(orderId as string, status);
    res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

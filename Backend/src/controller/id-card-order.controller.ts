import { Request, Response } from "express";
import * as orderService from "../services/id-card-order.service";

export const createIdCardOrder = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user.id;
    const order = await orderService.createIdCardOrderService(clientId, req.body);
    res.status(201).json({ success: true, message: "ID Card order placed successfully", data: order });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const getMyIdCardOrders = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user.id;
    const orders = await orderService.getClientIdCardOrdersService(clientId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMyIdCardOrderById = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user.id;
    const { orderId } = req.params;
    const order = await orderService.getClientIdCardOrderByIdService(orderId as string, clientId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdminIdCardOrders = async (req: Request, res: Response) => {
  try {
    const { status, clientId, productId } = req.query;
    const filters: any = {};
    if (status) filters.status = status;
    if (clientId) filters.clientId = clientId;
    if (productId) filters.productId = productId;

    const orders = await orderService.getAdminIdCardOrdersService(filters);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAdminIdCardOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getAdminIdCardOrderByIdService(orderId as string);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateIdCardOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderService.updateIdCardOrderStatusService(orderId as string, status);
    res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

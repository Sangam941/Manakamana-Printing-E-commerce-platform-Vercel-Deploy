import prisma from "../connect";
import { AppError } from "../utils/apperror";

export const createIdCardOrderService = async (clientId: string, data: any) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Validate Product
    const product = await tx.orderProduct.findUnique({
      where: { id: data.productId, isActive: true },
    });

    if (!product) throw new AppError("Product not found or inactive", 404);
    if (data.quantity < product.minQty) {
      throw new AppError(`Minimum quantity for this product is ${product.minQty}`, 400);
    }

    // 2. Calculate Pricing with Discounts
    const subtotal = Number(product.basePrice) * data.quantity;
    
    // Percent Discount
    const discountPercentVal = Number(product.discountPercent || 0);
    const percentDiscountAmount = subtotal * (discountPercentVal / 100);
    
    // Flat Discount (per unit)
    const flatDiscountAmount = Number(product.discountAmount || 0) * data.quantity;
    
    const totalDiscount = percentDiscountAmount + flatDiscountAmount;
    const totalAmount = Math.max(0, subtotal - totalDiscount);

    // 3. Check Wallet if payFromWallet is true
    let paymentStatus: any = "pending";
    let status: any = "pending_payment";
    let walletTransactionId: string | null = null;

    if (data.payFromWallet) {
      const wallet = await tx.walletAccount.findUnique({
        where: { clientId },
      });

      if (!wallet) throw new AppError("Wallet not found. Please top up first.", 400);

      const currentBalance = Number(wallet.availableBalance);
      if (currentBalance < totalAmount) {
        throw new AppError(`Insufficient wallet balance. Available: NPR ${currentBalance}, Required: NPR ${totalAmount}`, 400);
      }

      const newBalance = currentBalance - totalAmount;

      // Create wallet transaction
      const txn = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          clientId,
          type: "DEBIT",
          source: "ORDER",
          sourceId: "TEMP_ID", // Will update after order creation or use orderId if we create order first
          amount: totalAmount,
          currency: wallet.currency,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          description: `Payment for ID card order: ${data.orderName}`,
        },
      });

      // Update wallet balance
      await tx.walletAccount.update({
        where: { id: wallet.id },
        data: { availableBalance: newBalance },
      });

      walletTransactionId = txn.id;
      paymentStatus = "paid";
      status = "confirmed";
    }

    // 4. Create Main Order
    const mainOrder = await tx.idCardOrderMain.create({
      data: {
        clientId,
        productId: data.productId,
        orderName: data.orderName,
        status,
        paymentStatus,
        subtotal,
        discountPercent: discountPercentVal,
        discountAmount: Number(product.discountAmount || 0),
        totalAmount,
        walletTransactionId,
      },
    });

    // 5. Create Order Details
    await tx.idCardOrder.create({
      data: {
        orderId: mainOrder.id,
        quantity: data.quantity,
        printingSide: data.printingSide,
        photosLink: data.photosLink,
        orientation: data.orientation,
        stripeColor: data.stripeColor,
        stripeText: data.stripeText,
        remark: data.remark,
      },
    });

    // 6. Update Wallet Transaction Source ID if it was wallet payment
    if (walletTransactionId) {
      await tx.walletTransaction.update({
        where: { id: walletTransactionId },
        data: { sourceId: mainOrder.id },
      });

      // Create Notification
      await tx.notification.create({
        data: {
          recipientRole: "CLIENT",
          recipientId: clientId,
          clientId,
          type: "id_card_order_placed_paid",
          title: "Order Placed & Paid",
          message: `Your ID card order "${data.orderName}" has been placed and paid via wallet.`,
          referenceId: mainOrder.id,
        },
      });
    } else {
       // Create Notification for unpaid order
       await tx.notification.create({
        data: {
          recipientRole: "CLIENT",
          recipientId: clientId,
          clientId,
          type: "id_card_order_placed_pending",
          title: "Order Placed",
          message: `Your ID card order "${data.orderName}" has been placed. Please complete the payment.`,
          referenceId: mainOrder.id,
        },
      });
    }

    return mainOrder;
  });
};

export const getClientIdCardOrdersService = async (clientId: string) => {
  return await prisma.idCardOrderMain.findMany({
    where: { clientId },
    include: {
      product: { select: { name: true, code: true } },
      idCardDetails: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getClientIdCardOrderByIdService = async (orderId: string, clientId: string) => {
  return await prisma.idCardOrderMain.findFirst({
    where: { id: orderId, clientId },
    include: {
      product: { select: { name: true, code: true, previewImageUrl: true } },
      idCardDetails: true,
    },
  });
};

export const getAdminIdCardOrdersService = async (filters: any = {}) => {
  return await prisma.idCardOrderMain.findMany({
    where: filters,
    include: {
      client: { select: { business_name: true, phone_number: true, owner_name: true } },
      product: { select: { name: true, code: true } },
      idCardDetails: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAdminIdCardOrderByIdService = async (orderId: string) => {
  return await prisma.idCardOrderMain.findUnique({
    where: { id: orderId },
    include: {
      client: { select: { business_name: true, phone_number: true, owner_name: true, email: true, address: true } },
      product: { select: { name: true, code: true } },
      idCardDetails: true,
    },
  });
};

export const updateIdCardOrderStatusService = async (orderId: string, status: any) => {
  return await prisma.idCardOrderMain.update({
    where: { id: orderId },
    data: { status },
  });
};

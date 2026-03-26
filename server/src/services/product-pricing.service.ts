import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const resolveCombinationPrice = async (
  variantId: string,
  options: {
    holder_type?: string | null;
    paper_quality?: string | null;
    page_color?: string | null;
    binding?: string | null;
  }
) => {
  const { holder_type, paper_quality, page_color, binding } = options;

  const pricing = await prisma.variantPricing.findFirst({
    where: {
      variant_id: variantId,
      holder_type: holder_type || null,
      paper_quality: paper_quality || null,
      page_color: page_color || null,
      binding: binding || null,
      is_active: true,
    },
  });

  return pricing ? pricing.price : null;
};

export const calculateOrderAmount = (
  unitPrice: number,
  quantity: number,
  discount?: { type: "percentage" | "fixed"; value: number }
) => {
  const totalAmount = unitPrice * quantity;
  let discountAmount = 0;

  if (discount) {
    if (discount.type === "percentage") {
      discountAmount = totalAmount * (discount.value / 100);
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }
  }

  const finalAmount = Math.max(0, totalAmount - discountAmount);

  return {
    totalAmount,
    discountAmount,
    finalAmount,
  };
};

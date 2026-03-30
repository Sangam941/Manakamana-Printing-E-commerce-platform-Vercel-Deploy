import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Product Management
export const createProductService = async (data: any) => {
  return await prisma.product.create({ data });
};

export const getAllProductsService = async () => {
  return await prisma.product.findMany({
    include: { variants: true },
  });
};

// Variant Management
export const createVariantService = async (productId: string, data: any) => {
  return await prisma.productVariant.create({
    data: {
      product_id: productId,
      ...data,
    },
  });
};

// Option Group & Value Management
export const createOptionGroupService = async (variantId: string, data: any) => {
  return await prisma.optionGroup.create({
    data: {
      variant_id: variantId,
      ...data,
    },
  });
};

export const createOptionValueService = async (groupId: string, data: any) => {
  return await prisma.optionValue.create({
    data: {
      group_id: groupId,
      ...data,
    },
  });
};

// Pricing Combination Management
export const createVariantPricingService = async (variantId: string, data: any) => {
  return await prisma.variantPricing.create({
    data: {
      variant_id: variantId,
      ...data,
    },
  });
};

export const getVariantDetailsWithPricingInfo = async (variantId: string) => {
  return await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      option_groups: {
        include: { values: true },
      },
      pricing: true,
    },
  });
};

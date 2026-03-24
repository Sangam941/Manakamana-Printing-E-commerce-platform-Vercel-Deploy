import prisma from "../connect";

export const getProductsByCategoryService = async (categoryId: string, activeOnly: boolean = false) => {
  return await prisma.orderProduct.findMany({
    where: {
      categoryId,
      ...(activeOnly ? { isActive: true } : {}),
    },
    orderBy: { name: "asc" },
  });
};

export const getProductByIdService = async (id: string) => {
  return await prisma.orderProduct.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });
};

export const getAllProductsAdminService = async () => {
  return await prisma.orderProduct.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const createProductService = async (data: any) => {
  return await prisma.orderProduct.create({
    data,
  });
};

export const updateProductService = async (id: string, data: any) => {
  return await prisma.orderProduct.update({
    where: { id },
    data,
  });
};

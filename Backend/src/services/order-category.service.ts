import prisma from "../connect";

export const getAllCategoriesService = async (activeOnly: boolean = false) => {
  return await prisma.orderCategory.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { name: "asc" },
  });
};

export const getCategoryByIdService = async (id: string) => {
  return await prisma.orderCategory.findUnique({
    where: { id },
    include: { products: true },
  });
};

export const createCategoryService = async (data: any) => {
  return await prisma.orderCategory.create({
    data,
  });
};

export const updateCategoryService = async (id: string, data: any) => {
  return await prisma.orderCategory.update({
    where: { id },
    data,
  });
};

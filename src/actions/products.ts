"use server";

import { prisma } from "@/db/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  categoryId: z.string().optional(),
  costPrice: z.number().positive(),
  sellingPrice: z.number().positive(),
  shelfLifeDays: z.number().int().optional(),
  unit: z.enum(["KG", "LITRE", "PIECE", "GRAM", "ML", "UNIT", "BOX", "PACKET"]),
  reorderLevel: z.number().optional(),
  shopId: z.string().optional(),
});

export async function getProducts(tenantId: string) {
  return prisma.product.findMany({
    where: { tenantId, isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategories(tenantId: string) {
  return prisma.category.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createProduct(tenantId: string, data: z.infer<typeof productSchema>) {
  const parsed = productSchema.parse(data);
  const product = await prisma.product.create({
    data: { ...parsed, tenantId },
  });
  revalidatePath("/dashboard/products");
  return product;
}

export async function updateProduct(id: string, tenantId: string, data: Partial<z.infer<typeof productSchema>>) {
  const product = await prisma.product.updateMany({
    where: { id, tenantId },
    data,
  });
  revalidatePath("/dashboard/products");
  return product;
}

export async function deleteProduct(id: string, tenantId: string) {
  await prisma.product.updateMany({
    where: { id, tenantId },
    data: { isActive: false },
  });
  revalidatePath("/dashboard/products");
}

export async function createCategory(tenantId: string, name: string) {
  const category = await prisma.category.create({
    data: { name, tenantId },
  });
  revalidatePath("/dashboard/products");
  return category;
}

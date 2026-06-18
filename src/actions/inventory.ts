"use server";

import { prisma } from "@/db/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const stockMovementSchema = z.object({
  productId: z.string(),
  shopId: z.string(),
  quantity: z.number().positive(),
  unitCost: z.number().optional(),
  reason: z.string().optional(),
});

export async function getInventory(tenantId: string) {
  return prisma.inventory.findMany({
    where: { tenantId },
    include: { product: { include: { category: true } }, shop: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function stockIn(tenantId: string, data: z.infer<typeof stockMovementSchema>) {
  const parsed = stockMovementSchema.parse(data);
  const existing = await prisma.inventory.findUnique({
    where: { productId_shopId: { productId: parsed.productId, shopId: parsed.shopId } },
  });

  if (existing) {
    await prisma.inventory.update({
      where: { id: existing.id },
      data: { quantity: { increment: parsed.quantity } },
    });
  } else {
    await prisma.inventory.create({
      data: {
        productId: parsed.productId,
        shopId: parsed.shopId,
        quantity: parsed.quantity,
        tenantId,
      },
    });
  }

  await prisma.stockLog.create({
    data: {
      type: "STOCK_IN",
      quantity: parsed.quantity,
      unitCost: parsed.unitCost,
      reason: parsed.reason,
      productId: parsed.productId,
      shopId: parsed.shopId,
      tenantId,
    },
  });

  revalidatePath("/dashboard/inventory");
}

export async function stockOut(tenantId: string, data: z.infer<typeof stockMovementSchema>) {
  const parsed = stockMovementSchema.parse(data);
  const existing = await prisma.inventory.findUnique({
    where: { productId_shopId: { productId: parsed.productId, shopId: parsed.shopId } },
  });

  if (!existing) throw new Error("No inventory found for this product");
  if (existing.quantity.toNumber() < parsed.quantity) throw new Error("Insufficient stock");

  await prisma.inventory.update({
    where: { id: existing.id },
    data: { quantity: { decrement: parsed.quantity } },
  });

  await prisma.stockLog.create({
    data: {
      type: "STOCK_OUT",
      quantity: parsed.quantity,
      reason: parsed.reason,
      productId: parsed.productId,
      shopId: parsed.shopId,
      tenantId,
    },
  });

  revalidatePath("/dashboard/inventory");
}

export async function getLowStock(tenantId: string) {
  const inventory = await prisma.inventory.findMany({
    where: { tenantId },
    include: { product: true },
  });
  return inventory.filter((item: any) => {
    const reorder = item.product.reorderLevel?.toNumber() || 0;
    return item.quantity.toNumber() <= reorder;
  });
}

export async function getStockLogs(tenantId: string, limit = 50) {
  return prisma.stockLog.findMany({
    where: { tenantId },
    include: { product: true, shop: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

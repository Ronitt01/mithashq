"use server";

import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";

const DEMO_PASSWORD = "demo123456";
const DEMO_EMAIL = "demo@mithashq.com";

export async function createDemoData() {
  try {
    // Delete existing demo user if exists
    const existingUser = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
      include: { tenant: true },
    });

    if (existingUser?.tenant) {
      await prisma.tenant.delete({
        where: { id: existingUser.tenant.id },
      });
    }

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);

    const tenant = await prisma.tenant.create({
      data: {
        name: "Sharma Sweets & Dairy",
        slug: "sharma-sweets-demo",
        plan: "GROWTH",
        isDemo: true,
      },
    });

    const shop = await prisma.shop.create({
      data: {
        name: "Main Shop - Johari Bazar",
        address: "Johari Bazar, Jaipur, Rajasthan",
        phone: "+91 98765 43210",
        tenantId: tenant.id,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: "Demo User",
        email: DEMO_EMAIL,
        password: hashedPassword,
        role: "OWNER",
        tenantId: tenant.id,
      },
    });

    // Categories
    const categories = await Promise.all([
      prisma.category.create({ data: { name: "Sweets", tenantId: tenant.id } }),
      prisma.category.create({ data: { name: "Dairy", tenantId: tenant.id } }),
      prisma.category.create({ data: { name: "Raw Materials", tenantId: tenant.id } }),
      prisma.category.create({ data: { name: "Namkeen", tenantId: tenant.id } }),
    ]);

    // Products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Kaju Katli", sku: "SW-KK-001", categoryId: categories[0].id,
          costPrice: 400, sellingPrice: 600, shelfLifeDays: 7, unit: "KG",
          reorderLevel: 5, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Gulab Jamun", sku: "SW-GJ-002", categoryId: categories[0].id,
          costPrice: 250, sellingPrice: 400, shelfLifeDays: 3, unit: "KG",
          reorderLevel: 8, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Rasgulla", sku: "SW-RS-003", categoryId: categories[0].id,
          costPrice: 200, sellingPrice: 350, shelfLifeDays: 5, unit: "KG",
          reorderLevel: 6, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Milk (Full Cream)", sku: "DR-MK-001", categoryId: categories[1].id,
          costPrice: 50, sellingPrice: 65, shelfLifeDays: 2, unit: "LITRE",
          reorderLevel: 50, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Paneer", sku: "DR-PN-001", categoryId: categories[1].id,
          costPrice: 280, sellingPrice: 400, shelfLifeDays: 5, unit: "KG",
          reorderLevel: 10, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Dahi", sku: "DR-DH-001", categoryId: categories[1].id,
          costPrice: 60, sellingPrice: 90, shelfLifeDays: 4, unit: "KG",
          reorderLevel: 15, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Khoya", sku: "RM-KH-001", categoryId: categories[2].id,
          costPrice: 320, sellingPrice: 0, shelfLifeDays: 7, unit: "KG",
          reorderLevel: 8, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Ghee", sku: "RM-GH-001", categoryId: categories[2].id,
          costPrice: 450, sellingPrice: 0, shelfLifeDays: 180, unit: "KG",
          reorderLevel: 5, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Samosa", sku: "NK-SM-001", categoryId: categories[3].id,
          costPrice: 8, sellingPrice: 15, shelfLifeDays: 1, unit: "PIECE",
          reorderLevel: 100, tenantId: tenant.id, shopId: shop.id,
        },
      }),
      prisma.product.create({
        data: {
          name: "Kachori", sku: "NK-KC-001", categoryId: categories[3].id,
          costPrice: 10, sellingPrice: 18, shelfLifeDays: 1, unit: "PIECE",
          reorderLevel: 80, tenantId: tenant.id, shopId: shop.id,
        },
      }),
    ]);

    // Inventory
    const inventoryData = [
      { product: products[0], qty: 12 },
      { product: products[1], qty: 8 },
      { product: products[2], qty: 15 },
      { product: products[3], qty: 45 },
      { product: products[4], qty: 10 },
      { product: products[5], qty: 20 },
      { product: products[6], qty: 5 },
      { product: products[7], qty: 8 },
      { product: products[8], qty: 150 },
      { product: products[9], qty: 100 },
    ];

    for (const inv of inventoryData) {
      await prisma.inventory.create({
        data: {
          productId: inv.product.id,
          quantity: inv.qty,
          tenantId: tenant.id,
          shopId: shop.id,
        },
      });
      await prisma.stockLog.create({
        data: {
          type: "STOCK_IN",
          quantity: inv.qty,
          productId: inv.product.id,
          tenantId: tenant.id,
          shopId: shop.id,
          reason: "Initial stock",
        },
      });
    }

    // Customers
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: "Hotel Raj Palace", phone: "+91 98765 11111",
          type: "HOTEL", creditLimit: 50000, tenantId: tenant.id,
        },
      }),
      prisma.customer.create({
        data: {
          name: "Cafe Delight", phone: "+91 98765 22222",
          type: "CAFE", creditLimit: 30000, tenantId: tenant.id,
        },
      }),
      prisma.customer.create({
        data: {
          name: "Sharma Caterers", phone: "+91 98765 33333",
          type: "CATERER", creditLimit: 75000, tenantId: tenant.id,
        },
      }),
      prisma.customer.create({
        data: {
          name: "Royal Restaurant", phone: "+91 98765 44444",
          type: "RESTAURANT", creditLimit: 25000, tenantId: tenant.id,
        },
      }),
    ]);

    // Deliveries & Payments
    const deliveries = [
      {
        customer: customers[0], items: [
          { product: products[0], qty: 5, price: 600 },
          { product: products[1], qty: 3, price: 400 },
        ],
        total: 4200, payment: 2000, method: "UPI" as const,
      },
      {
        customer: customers[1], items: [
          { product: products[3], qty: 20, price: 65 },
          { product: products[4], qty: 5, price: 400 },
        ],
        total: 3300, payment: 0, method: "CREDIT" as const,
      },
      {
        customer: customers[2], items: [
          { product: products[0], qty: 10, price: 600 },
          { product: products[2], qty: 8, price: 350 },
          { product: products[6], qty: 5, price: 0 },
        ],
        total: 8800, payment: 5000, method: "BANK_TRANSFER" as const,
      },
      {
        customer: customers[3], items: [
          { product: products[1], qty: 4, price: 400 },
          { product: products[8], qty: 50, price: 15 },
        ],
        total: 2350, payment: 2350, method: "CASH" as const,
      },
    ];

    for (const d of deliveries) {
      const delivery = await prisma.delivery.create({
        data: {
          totalAmount: d.total,
          tenantId: tenant.id,
          shopId: shop.id,
          customerId: d.customer.id,
        },
      });

      for (const item of d.items) {
        await prisma.deliveryItem.create({
          data: {
            productId: item.product.id,
            quantity: item.qty,
            unitPrice: item.price,
            totalPrice: item.qty * item.price,
            deliveryId: delivery.id,
          },
        });
      }

      await prisma.payment.create({
        data: {
          amount: d.payment,
          method: d.method,
          status: d.payment === d.total ? "COMPLETED" : "PARTIAL",
          tenantId: tenant.id,
          shopId: shop.id,
          customerId: d.customer.id,
          deliveryId: delivery.id,
        },
      });
    }

    // Production Batches
    const batch = await prisma.productionBatch.create({
      data: {
        name: "Morning Sweets Batch - 18 June",
        plannedDate: new Date(),
        actualDate: new Date(),
        status: "COMPLETED",
        notes: "Daily production for Diwali prep",
        tenantId: tenant.id,
        shopId: shop.id,
      },
    });

    await prisma.productionBatchItem.create({
      data: {
        productId: products[6].id, // Khoya
        plannedQty: 10,
        actualQty: 9.5,
        unitCost: 320,
        batchId: batch.id,
      },
    });

    await prisma.productionOutput.create({
      data: {
        productId: products[0].id, // Kaju Katli
        quantity: 8,
        unitCost: 450,
        batchId: batch.id,
      },
    });

    // Festivals
    await prisma.festival.createMany({
      data: [
        { name: "Diwali", date: new Date("2026-11-12"), impact: "High demand for all sweets", region: "All India", tenantId: tenant.id },
        { name: "Holi", date: new Date("2026-03-15"), impact: "High demand for gujiya and thandai", region: "North India", tenantId: tenant.id },
        { name: "Raksha Bandhan", date: new Date("2026-08-22"), impact: "Moderate demand for sweets", region: "All India", tenantId: tenant.id },
      ],
    });

    return {
      success: true,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      userId: user.id,
    };
  } catch (error) {
    console.error("Demo creation error:", error);
    const message = error instanceof Error ? error.message : String(error);
    // Surface the real cause (e.g. missing table / bad DATABASE_URL) instead of a generic string.
    return { success: false, error: `Failed to create demo data: ${message}` };
  }
}

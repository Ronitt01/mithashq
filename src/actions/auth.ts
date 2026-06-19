"use server";

import { prisma } from "@/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  shopName: z.string().min(2),
});

export async function signUp(data: z.infer<typeof signUpSchema>) {
  try {
    const parsed = signUpSchema.parse(data);

    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (existing) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 12);

    const tenant = await prisma.tenant.create({
      data: {
        name: parsed.shopName,
        slug: parsed.shopName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        plan: "FREE",
      },
    });

    const shop = await prisma.shop.create({
      data: {
        name: parsed.shopName,
        tenantId: tenant.id,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashedPassword,
        role: "OWNER",
        tenantId: tenant.id,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Sign up error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to create account: ${message}` };
  }
}

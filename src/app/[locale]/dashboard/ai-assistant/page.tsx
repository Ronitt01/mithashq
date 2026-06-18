import { auth } from "@/lib/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import { AIChatClient } from "@/components/dashboard/AIChatClient";

export default async function AIAssistantPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.tenantId) {
    redirect(`/${locale}/login`);
  }

  // Get business context for the AI
  const [
    products,
    inventory,
    customers,
    payments,
    deliveries,
  ] = await Promise.all([
    prisma.product.count({ where: { tenantId: session.user.tenantId, isActive: true } }),
    prisma.inventory.findMany({
      where: { tenantId: session.user.tenantId },
      include: { product: true },
    }),
    prisma.customer.findMany({ where: { tenantId: session.user.tenantId, isActive: true } }),
    prisma.payment.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.delivery.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: true },
    }),
  ]);

  const outstanding = payments
    .filter((p) => p.status === "PENDING" || p.status === "PARTIAL")
    .reduce((sum, p) => sum + (p.amount?.toNumber() || 0), 0);

  const lowStock = inventory.filter((item) => {
    const reorder = item.product.reorderLevel?.toNumber() || 0;
    return item.quantity.toNumber() <= reorder;
  });

  const context = `
Business: ${products} active products, ${inventory.length} inventory items, ${customers.length} customers.
Low stock alerts: ${lowStock.map((i) => `${i.product.name} (${i.quantity.toNumber()} ${i.product.unit})`).join(", ") || "None"}.
Outstanding payments: ₹${outstanding.toLocaleString()}.
Recent deliveries: ${deliveries.length} in the last period.
Top customers by recent deliveries: ${customers.slice(0, 3).map((c) => c.name).join(", ") || "N/A"}.
`;

  return (
    <AIChatClient
      locale={locale}
      userName={session.user.name || "User"}
      context={context}
    />
  );
}

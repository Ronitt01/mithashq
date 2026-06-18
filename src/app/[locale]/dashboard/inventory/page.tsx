import { auth } from "@/lib/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import { InventoryClient } from "@/components/dashboard/InventoryClient";

export default async function InventoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.tenantId) {
    redirect(`/${locale}/login`);
  }

  const [inventory, products, logs] = await Promise.all([
    prisma.inventory.findMany({
      where: { tenantId: session.user.tenantId },
      include: { product: { include: { category: true } }, shop: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.product.findMany({
      where: { tenantId: session.user.tenantId, isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.stockLog.findMany({
      where: { tenantId: session.user.tenantId },
      include: { product: true, shop: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <InventoryClient
      inventory={inventory}
      products={products}
      logs={logs}
      tenantId={session.user.tenantId}
      locale={locale}
    />
  );
}

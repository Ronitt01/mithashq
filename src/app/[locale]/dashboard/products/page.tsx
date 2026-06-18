import { auth } from "@/lib/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import { ProductsClient } from "@/components/dashboard/ProductsClient";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.tenantId) {
    redirect(`/${locale}/login`);
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { tenantId: session.user.tenantId, isActive: true },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ProductsClient
      products={products}
      categories={categories}
      tenantId={session.user.tenantId}
      locale={locale}
    />
  );
}

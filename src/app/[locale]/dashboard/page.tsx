import { auth } from "@/lib/auth";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  IndianRupee, 
  Factory,
  AlertTriangle
} from "lucide-react";
import { format, subDays } from "date-fns";

async function getDashboardData(tenantId: string) {
  const today = new Date();
  const lastWeek = subDays(today, 7);

  const [
    totalProducts,
    inventoryItems,
    lowStockItems,
    totalCustomers,
    totalDeliveries,
    totalRevenue,
    totalOutstanding,
    completedBatches,
  ] = await Promise.all([
    prisma.product.count({ where: { tenantId, isActive: true } }),
    prisma.inventory.count({ where: { tenantId } }),
    prisma.inventory.findMany({
      where: { tenantId },
      include: { product: true },
    }),
    prisma.customer.count({ where: { tenantId, isActive: true } }),
    prisma.delivery.count({ where: { tenantId, date: { gte: lastWeek } } }),
    prisma.delivery.aggregate({
      where: { tenantId, date: { gte: lastWeek } },
      _sum: { totalAmount: true },
    }),
    prisma.payment.aggregate({
      where: { tenantId, status: { in: ["PENDING", "PARTIAL"] } },
      _sum: { amount: true },
    }),
    prisma.productionBatch.count({
      where: { tenantId, status: "COMPLETED", plannedDate: { gte: lastWeek } },
    }),
  ]);

  const lowStock = lowStockItems.filter((item) => {
    const reorderLevel = item.product.reorderLevel?.toNumber() || 0;
    return item.quantity.toNumber() <= reorderLevel;
  });

  return {
    totalProducts,
    inventoryItems,
    lowStockCount: lowStock.length,
    totalCustomers,
    totalDeliveries,
    revenue: totalRevenue._sum.totalAmount?.toNumber() || 0,
    outstanding: totalOutstanding._sum.amount?.toNumber() || 0,
    completedBatches,
  };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.tenantId) {
    redirect(`/${locale}/login`);
  }

  const data = await getDashboardData(session.user.tenantId);

  const stats = [
    {
      title: "Total Products",
      value: data.totalProducts.toString(),
      change: "Active",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      trend: "up",
    },
    {
      title: "Inventory Items",
      value: data.inventoryItems.toString(),
      change: `${data.lowStockCount} low stock`,
      icon: Package,
      color: "bg-amber-50 text-amber-600",
      trend: "down",
    },
    {
      title: "Customers",
      value: data.totalCustomers.toString(),
      change: "Active B2B",
      icon: Users,
      color: "bg-green-50 text-green-600",
      trend: "up",
    },
    {
      title: "Weekly Revenue",
      value: `₹${data.revenue.toLocaleString()}`,
      change: `${data.totalDeliveries} deliveries`,
      icon: IndianRupee,
      color: "bg-purple-50 text-purple-600",
      trend: "up",
    },
    {
      title: "Outstanding",
      value: `₹${data.outstanding.toLocaleString()}`,
      change: "Pending payments",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      trend: "down",
    },
    {
      title: "Production Batches",
      value: data.completedBatches.toString(),
      change: "Completed this week",
      icon: Factory,
      color: "bg-orange-50 text-orange-600",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h1>
        <p className="text-gray-600">Overview of your business</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Add Stock", href: `/${locale}/dashboard/inventory`, color: "bg-blue-600" },
          { label: "New Delivery", href: `/${locale}/dashboard/customers`, color: "bg-green-600" },
          { label: "Record Payment", href: `/${locale}/dashboard/payments`, color: "bg-purple-600" },
          { label: "Plan Production", href: `/${locale}/dashboard/production`, color: "bg-orange-600" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`${action.color} text-white px-4 py-3 rounded-xl font-semibold text-sm text-center hover:opacity-90 transition-opacity`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}

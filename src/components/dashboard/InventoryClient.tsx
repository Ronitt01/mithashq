'use client';

import { useState } from "react";
import { stockIn, stockOut } from "@/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Warehouse, ArrowUp, ArrowDown, Search, Package, X, AlertTriangle } from "lucide-react";

interface InventoryClientProps {
  inventory: any[];
  products: any[];
  logs: any[];
  tenantId: string;
  locale: string;
}

export function InventoryClient({ inventory, products, logs, tenantId, locale }: InventoryClientProps) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"in" | "out">("in");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const shopId = inventory[0]?.shopId || products[0]?.shopId || "";

  const filtered = inventory.filter((item) =>
    item.product.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = filtered.filter((item) => {
    const reorder = Number(item.product.reorderLevel) || 0;
    return Number(item.quantity) <= reorder;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId || !quantity || !shopId) return;
    setLoading(true);
    try {
      if (formType === "in") {
        await stockIn(tenantId, { productId, shopId, quantity: Number(quantity), reason });
      } else {
        await stockOut(tenantId, { productId, shopId, quantity: Number(quantity), reason });
      }
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Inventory</h1>
          <p className="text-gray-600">{inventory.length} items tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          <Button onClick={() => { setFormType("in"); setShowForm(true); }}>
            <ArrowUp className="w-4 h-4 mr-1" /> Stock In
          </Button>
          <Button onClick={() => { setFormType("out"); setShowForm(true); }}>
            <ArrowDown className="w-4 h-4 mr-1" /> Stock Out
          </Button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Low Stock Alert</p>
              <p className="text-xs text-amber-700">
                {lowStock.map((i) => i.product.name).join(", ")} — need restocking
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Form Modal */}
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1A1A2E]">
                {formType === "in" ? "Stock In" : "Stock Out"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Daily purchase, Production use, etc."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : formType === "in" ? "Add Stock" : "Remove Stock"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Reorder Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Shop</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const qty = Number(item.quantity);
                const reorder = Number(item.product.reorderLevel) || 0;
                const isLow = qty <= reorder;
                return (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#E85D04]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#1A1A2E]">{item.product.name}</div>
                          <div className="text-xs text-gray-500">{item.product.category?.name || "Uncategorized"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A2E]">
                      {qty} {item.product.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {reorder > 0 ? `${reorder} ${item.product.unit}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {isLow ? "Low Stock" : "OK"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.shop?.name || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <Warehouse className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No inventory found</p>
          </div>
        )}
      </div>

      {/* Recent Stock Logs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-[#1A1A2E]">Recent Stock Movements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1A2E]">{log.product.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.type === "STOCK_IN" ? "bg-green-100 text-green-700" :
                      log.type === "STOCK_OUT" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {log.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">{Number(log.quantity)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">No stock movements yet</div>
        )}
      </div>
    </div>
  );
}

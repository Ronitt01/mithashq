'use client';

import { useState } from "react";
import { createProduct, updateProduct, deleteProduct, createCategory } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Plus, Pencil, Trash2, X, Search, Tag } from "lucide-react";

interface ProductsClientProps {
  products: Array<{
    id: string;
    name: string;
    sku: string | null;
    costPrice: any;
    sellingPrice: any;
    shelfLifeDays: number | null;
    unit: string;
    reorderLevel: any;
    isActive: boolean;
    category: { id: string; name: string } | null;
  }>;
  categories: Array<{ id: string; name: string }>;
  tenantId: string;
  locale: string;
}

export function ProductsClient({ products, categories, tenantId, locale }: ProductsClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [localProducts, setLocalProducts] = useState(products);
  const [localCategories, setLocalCategories] = useState(categories);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    costPrice: "",
    sellingPrice: "",
    shelfLifeDays: "",
    unit: "KG",
    reorderLevel: "",
  });

  const filtered = localProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.costPrice || Number(formData.costPrice) <= 0) errors.costPrice = "Cost price must be positive";
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) errors.sellingPrice = "Selling price must be positive";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const data = {
      name: formData.name.trim(),
      sku: formData.sku || undefined,
      categoryId: formData.categoryId || undefined,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      shelfLifeDays: formData.shelfLifeDays ? Number(formData.shelfLifeDays) : undefined,
      unit: formData.unit as any,
      reorderLevel: formData.reorderLevel ? Number(formData.reorderLevel) : undefined,
    };

    if (editingId) {
      await updateProduct(editingId, tenantId, data);
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...data,
                sku: data.sku || null,
                costPrice: data.costPrice,
                sellingPrice: data.sellingPrice,
                reorderLevel: data.reorderLevel ?? null,
                shelfLifeDays: data.shelfLifeDays ?? null,
                category: localCategories.find((c) => c.id === data.categoryId) || p.category,
              } as any
            : p
        )
      );
      setEditingId(null);
    } else {
      const newProduct = await createProduct(tenantId, data);
      if (newProduct) {
        setLocalProducts((prev) => [
          ...prev,
          {
            ...newProduct,
            category: localCategories.find((c) => c.id === data.categoryId) || null,
          } as any,
        ]);
      }
    }
    resetForm();
    setShowForm(false);
    setLoading(false);
  }

  function resetForm() {
    setFormData({
      name: "", sku: "", categoryId: "", costPrice: "", sellingPrice: "", shelfLifeDays: "", unit: "KG", reorderLevel: "",
    });
    setFormErrors({});
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(id, tenantId);
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEdit(product: (typeof localProducts)[0]) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku || "",
      categoryId: product.category?.id || "",
      costPrice: product.costPrice?.toNumber?.() || product.costPrice || "",
      sellingPrice: product.sellingPrice?.toNumber?.() || product.sellingPrice || "",
      shelfLifeDays: product.shelfLifeDays?.toString() || "",
      unit: product.unit,
      reorderLevel: product.reorderLevel?.toNumber?.() || product.reorderLevel || "",
    });
    setShowForm(true);
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    const cat = await createCategory(tenantId, newCategory.trim());
    if (cat) {
      setLocalCategories((prev) => [...prev, cat]);
      setNewCategory("");
      setShowCategoryForm(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Products</h1>
          <p className="text-gray-600">{localProducts.length} products in catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
            />
          </div>
          <Button
            onClick={() => {
              setEditingId(null);
              resetForm();
              setShowForm(!showForm);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Product
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1A1A2E]">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
                {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex gap-2">
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                  >
                    <option value="">Select category</option>
                    {localCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    className="px-2 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    title="Add category"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {showCategoryForm && (
                <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                  />
                  <Button type="button" onClick={handleAddCategory} size="sm">
                    Add Category
                  </Button>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
                {formErrors.costPrice && <p className="text-xs text-red-600 mt-1">{formErrors.costPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
                {formErrors.sellingPrice && <p className="text-xs text-red-600 mt-1">{formErrors.sellingPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                >
                  {["KG", "LITRE", "PIECE", "GRAM", "ML", "UNIT", "BOX", "PACKET"].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life (Days)</label>
                <input
                  type="number"
                  value={formData.shelfLifeDays}
                  onChange={(e) => setFormData({ ...formData, shelfLifeDays: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 outline-none"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-[#E85D04]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#1A1A2E]">{product.name}</div>
                        {product.shelfLifeDays && (
                          <div className="text-xs text-gray-500">Shelf life: {product.shelfLifeDays} days</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.sku || "—"}</td>
                  <td className="px-4 py-3">
                    {product.category ? (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700">{product.category.name}</span>
                    ) : (
                      <span className="text-xs text-gray-400">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    ₹{product.costPrice?.toNumber?.() || product.costPrice}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-[#E85D04]">
                    ₹{product.sellingPrice?.toNumber?.() || product.sellingPrice}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.unit}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#E85D04] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Package, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "ledger", label: "Ledger", icon: Users },
  { key: "forecasting", label: "Forecasting", icon: TrendingUp },
];

export function Showcase({ locale }: { locale: string }) {
  const [active, setActive] = useState("dashboard");
  const t = useTranslations();

  const renderMock = () => {
    switch (active) {
      case "dashboard":
        return (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Revenue", value: "₹1,24,500", change: "+12%", positive: true },
              { label: "Outstanding", value: "₹45,200", change: "8 customers", positive: false },
              { label: "Inventory", value: "127 items", change: "3 low stock", positive: false },
              { label: "Production", value: "85%", change: "Efficiency", positive: true },
            ].map((card) => (
              <div key={card.label} className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">{card.label}</div>
                <div className="text-xl font-bold text-[#1A1A2E]">{card.value}</div>
                <div className={`text-xs mt-1 ${card.positive ? "text-green-600" : "text-amber-600"}`}>{card.change}</div>
              </div>
            ))}
            <div className="col-span-2 bg-gray-50 rounded-xl p-4 h-32 flex items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-[#E85D04]/80" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-3">
            {[
              { name: "Milk (Full Cream)", qty: "45 L", status: "OK" },
              { name: "Khoya", qty: "12 KG", status: "Low" },
              { name: "Ghee", qty: "8 KG", status: "OK" },
              { name: "Sugar", qty: "25 KG", status: "OK" },
              { name: "Dry Fruits (Almonds)", qty: "3 KG", status: "Low" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <div className="text-sm font-medium text-[#1A1A2E]">{item.name}</div>
                  <div className="text-xs text-gray-500">Current Stock</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{item.qty}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "OK" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      case "ledger":
        return (
          <div className="space-y-3">
            {[
              { name: "Hotel Raj Palace", outstanding: "₹15,200", credit: "₹50,000" },
              { name: "Cafe Delight", outstanding: "₹8,500", credit: "₹30,000" },
              { name: "Sharma Caterers", outstanding: "₹22,000", credit: "₹75,000" },
              { name: "Royal Restaurant", outstanding: "₹0", credit: "₹25,000" },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <div className="text-sm font-medium text-[#1A1A2E]">{c.name}</div>
                  <div className="text-xs text-gray-500">Credit Limit: {c.credit}</div>
                </div>
                <div className={`text-sm font-semibold ${c.outstanding === "₹0" ? "text-green-600" : "text-[#D00000]"}`}>
                  {c.outstanding}
                </div>
              </div>
            ))}
          </div>
        );
      case "forecasting":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-[#1A1A2E] mb-3">Predicted Demand (Next 7 Days)</div>
              <div className="flex items-end gap-2 h-28">
                {[60, 80, 45, 90, 70, 55, 85].map((h, i) => {
                  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-[#E85D04]/80 rounded-t-md" style={{ height: `${h}%` }} />
                      <span className="text-xs text-gray-500">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="text-sm font-medium text-amber-800">Diwali Festival Alert</div>
              <div className="text-xs text-amber-700 mt-1">Predicted sweet demand to increase by 3x in the next 10 days. Consider increasing paneer and khoya production by 40%.</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            See MithasHQ in Action
          </h2>
          <p className="text-lg text-gray-600">Explore the platform before you sign up.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active === tab.key
                      ? "bg-[#E85D04] text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-[#1A1A2E] px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-gray-400 text-xs">mithashq.com/dashboard</span>
            </div>
            <div className="p-6">{renderMock()}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

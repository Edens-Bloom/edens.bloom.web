"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

const formatPrice = (value?: number) =>
  `Rs. ${Math.round(value ?? 0).toLocaleString("en-US")}`;

export default function AdminOrdersPage() {
  const { orders, fetchOrders, isLoading, error } = useStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="eyebrow">Orders</p>
        <h1 className="section-title">Order activity</h1>
        <p className="mt-2 text-slate-600">
          Keep track of customer orders and fulfillments from one place.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Order</th>
              <th className="px-4 py-3 font-semibold text-slate-700">
                Customer
              </th>
              <th className="px-4 py-3 font-semibold text-slate-700">Amount</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-200">
                <td className="px-4 py-4 font-medium text-slate-900">
                  {order.order_number}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {order.name || order.phone}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {formatPrice(order.total_amount)}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {orders.length === 0 && !isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-slate-600"
                >
                  No orders found yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

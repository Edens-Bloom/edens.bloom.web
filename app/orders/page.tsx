"use client";

import React, { useEffect } from "react";
import { AlertCircle, Calendar, Loader, Phone } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatRs } from "@/utils/formatRs";
import "./Orders.scss";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrdersPage() {
  const user = useStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const rehydrate = useStore((state) => state.rehydrate);
  const fetchOrders = useStore((state) => state.fetchOrders);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    if (user?.phoneNumber) {
      void fetchOrders(user.phoneNumber);
    }
  }, [fetchOrders, user?.phoneNumber]);

  if (isLoading) {
    return (
      <div className="customer-orders-loading">
        <Loader size={40} className="spin" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <main className="customer-orders-page">
      <div className="customer-orders-container">
        <header className="customer-orders-header">
          <p className="customer-orders-eyebrow">Your Eden&apos;s Bloom</p>
          <h1>My Orders</h1>
          <p>
            View your order history and track each order by its order number.
          </p>
        </header>

        {error && (
          <div className="customer-orders-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!user?.phoneNumber ? (
          <div className="customer-orders-empty">
            <h2>No customer details saved yet</h2>
            <p>Place an order first, and your orders will appear here.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="customer-orders-empty">
            <h2>No orders found</h2>
            <p>Orders placed with {user.phoneNumber} will appear here.</p>
          </div>
        ) : (
          <div className="customer-orders-list">
            {orders.map((order) => (
              <article className="customer-order" key={order.id}>
                <div className="customer-order-main">
                  <p className="customer-order-number">{order.order_number}</p>
                  <p className="customer-order-date">
                    <Calendar size={15} />
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="customer-order-meta">
                  <span
                    className={`customer-order-status status-${order.status}`}
                  >
                    {order.status}
                  </span>
                  <span className="customer-order-phone">
                    <Phone size={15} />
                    {order.phone}
                  </span>
                  <strong>{formatRs(Number(order.total_amount))}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

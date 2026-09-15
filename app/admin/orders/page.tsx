"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Loader,
  AlertCircle,
  Phone,
  Calendar,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { formatRs } from "@/utils/formatRs";
import type { Order, OrderItem, OrderStatus } from "@/types";
import { useStore } from "@/store/useStore";
import "./AdminOrders.scss";

const AdminOrders: React.FC = () => {
  const orders = useStore((s) => s.orders || []);
  const fetchOrders = useStore((s) => s.fetchOrders);
  const isLoading = useStore((s) => s.isLoading);
  const error = useStore((s) => s.error);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editedStatus, setEditedStatus] = useState<OrderStatus>("pending");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const orderStatuses: OrderStatus[] = [
    "pending",
    "ordered",
    "confirmed",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const handleOpenStatusEditor = () => {
    if (!selectedOrder) return;
    setEditedStatus(selectedOrder.status);
    setIsEditingStatus(true);
  };

  const handleCancelStatusEdit = () => {
    setIsEditingStatus(false);
    if (selectedOrder) setEditedStatus(selectedOrder.status);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || isSavingStatus) return;

    setIsSavingStatus(true);
    const saved = await updateOrderStatus(selectedOrder.id, editedStatus);
    if (saved) {
      setSelectedOrder({ ...selectedOrder, status: editedStatus });
      setIsEditingStatus(false);
    }
    setIsSavingStatus(false);
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at).getTime();
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesFromDate =
      !fromDate || orderDate >= new Date(`${fromDate}T00:00:00`).getTime();
    const matchesToDate =
      !toDate || orderDate <= new Date(`${toDate}T23:59:59.999`).getTime();

    return matchesStatus && matchesFromDate && matchesToDate;
  });

  const filteredTotal = filteredOrders.reduce(
    (total, order) => total + Number(order.total_amount || 0),
    0,
  );

  const clearFilters = () => {
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
  };

  if (isLoading) {
    return (
      <div className="admin-orders-loading">
        <Loader size={48} className="spin" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>Orders Management</h1>
          <p>Track and manage all customer orders</p>
          <button className="btn-refresh" onClick={fetchOrders}>
            Refresh
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="orders-filters" aria-label="Filter orders">
          <div className="order-filter-field">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as OrderStatus | "all")
              }
            >
              <option value="all">All statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="order-filter-field">
            <label htmlFor="from-date">From</label>
            <input
              id="from-date"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </div>
          <div className="order-filter-field">
            <label htmlFor="to-date">To</label>
            <input
              id="to-date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn-clear-filters"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>

        <div className="orders-filter-summary">
          <span>{filteredOrders.length} orders</span>
          <strong>Total: {formatRs(filteredTotal)}</strong>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>
              {orders.length === 0
                ? "No orders found"
                : "No matching orders found"}
            </p>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: Order) => (
                  <tr key={order.id} className="order-row">
                    <td className="order-number">
                      <strong>{order.order_number}</strong>
                    </td>
                    <td className="customer-name">{order.name || "Guest"}</td>
                    <td className="customer-phone">
                      <Phone size={14} />
                      {order.phone}
                    </td>
                    <td className="order-amount">
                      <strong>{formatRs(+order.total_amount)}</strong>
                    </td>
                    <td className="order-status">
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="order-date">
                      <Calendar size={14} />
                      {formatDate(order.created_at)}
                    </td>
                    <td className="order-actions">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedOrder(order as Order)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="order-detail-modal"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order {selectedOrder.order_number}</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedOrder.name || "Guest"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedOrder.email || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address:</label>
                    <span>{selectedOrder.address || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatRs(+selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.tax_amount > 0 && (
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>{formatRs(+selectedOrder.tax_amount)}</span>
                    </div>
                  )}
                  {selectedOrder.shipping_fee > 0 && (
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{formatRs(+selectedOrder.shipping_fee)}</span>
                    </div>
                  )}
                  {selectedOrder.discount_amount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>-{formatRs(+selectedOrder.discount_amount)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatRs(+selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Order Status</h3>
                {isEditingStatus ? (
                  <div className="status-editor">
                    <select
                      value={editedStatus}
                      onChange={(event) =>
                        setEditedStatus(event.target.value as OrderStatus)
                      }
                      aria-label="Order status"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="status-action status-action--save"
                      onClick={handleSaveStatus}
                      disabled={isSavingStatus}
                    >
                      <Check size={15} />
                      {isSavingStatus ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="status-action status-action--cancel"
                      onClick={handleCancelStatusEdit}
                      disabled={isSavingStatus}
                    >
                      <X size={15} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="status-display">
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        selectedOrder.status,
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                    <button
                      type="button"
                      className="status-edit-btn"
                      onClick={handleOpenStatusEditor}
                      aria-label="Edit order status"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Order Date</h3>
                <p>{formatDate(selectedOrder.created_at)}</p>
              </div>

              <div className="detail-section">
                <h3>Items</h3>
                <div className="order-items">
                  {(selectedOrder.items || []).map((item: OrderItem) => {
                    const imgUrl = item.addon
                      ? item.addon.imageUrl
                      : item.image_url;
                    const price = item.addon
                      ? item.addon.price
                      : item.price_at_order;
                    return (
                      <div className="order-item" key={item.id}>
                        <div className="item-image">
                          {item.image_url ? (
                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                            <img
                              src={imgUrl}
                              alt={item.product_name || "image"}
                            />
                          ) : null}
                        </div>
                        <div className="item-info">
                          <div className="item-name">{item.product_name}</div>
                          {item.addon_label && (
                            <div className="item-addon">{item.addon_label}</div>
                          )}
                          <div className="item-meta">
                            <span>Qty: {item.total_quantity}</span>
                            <span>Price: {formatRs(+price)}</span>
                            <span>Subtotal: {formatRs(+item.subtotal)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

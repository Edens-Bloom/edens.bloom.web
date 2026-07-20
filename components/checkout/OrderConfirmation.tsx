"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { formatRs } from "@/utils/formatRs";
import "./OrderConfirmation.scss";
import { useStore } from "@/store/useStore";
import type { User } from "@/types";
import { useRouter } from "next/navigation";

interface OrderConfirmationProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  total: number;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  onClose,
  onConfirm,
  total,
}) => {
  const { updateUser, user, clearCart } = useStore();
  const [orderNumber] = useState(() => Math.floor(Math.random() * 1000000));
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // const [user, setUserInfo] = useState<User>({
  //   name: user?.name || "",
  //   phoneNumber: user?.phoneNumber || "",
  //   address: user?.address || "",
  //   email: user?.email || "",
  // });

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "description") {
      setDescription(value);
      return;
    }

    updateUser({ ...user, [name]: value } as Partial<User>);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (user?.name && user.phoneNumber && user.address) {
      try {
        setIsSubmitting(true);
        await onConfirm();
        clearCart();
        setIsFormSubmitted(true);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to submit order.";
        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid =
    (user?.name?.length || 0) > 2 &&
    (user?.phoneNumber?.length || 0) === 10 &&
    (user?.address?.length || 0) > 4;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!isFormSubmitted ? (
          <>
            <div className="modal-header">
              <h2>Confirm Your Information</h2>
              <p>
                Please provide your details to proceed with your order. We’ll
                call you to confirm. Thank you!
              </p>
            </div>

            <form className="modal-body" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user?.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phoneNumber"
                  value={user?.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={user?.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your delivery address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                  placeholder="Enter any additional details"
                  rows={3}
                />
              </div>

              <div className="order-summary">
                <div className="detail-row">
                  <span>Total Amount</span>
                  <span className="amount">{formatRs(total)}</span>
                </div>
              </div>

              {submitError && <div className="form-error">{submitError}</div>}
              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={onClose}
                >
                  <ShoppingBag size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Submitting order..." : "Proceed to Order"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="modal-header">
              <div className="success-icon">
                <CheckCircle size={48} strokeWidth={1.5} />
              </div>
              <h2>Thank You for Your Order!</h2>
              <p>Order #BLOOM-{orderNumber}</p>
            </div>

            <div className="modal-body">
              <div className="order-details">
                <div className="detail-row">
                  <span>Status</span>
                  <span className="status-badge">Confirmed</span>
                </div>
                <div className="detail-row">
                  <span>Total Amount</span>
                  <span className="amount">{formatRs(total)}</span>
                </div>
              </div>

              <div className="confirmation-message">
                <p>
                  We've received your order and we're getting it ready for
                  shipment. You'll receive a confirmation email shortly with
                  tracking details.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => router.push("/")}>
                <ShoppingBag size={18} /> View Details
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  clearCart();
                  router.push("/");
                }}
              >
                <Home size={18} /> Return to Shop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatRs } from "@/utils/formatRs";
import "./Cart.scss";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import type { SelectedProduct } from "@/types";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCart, onConfirm } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = () => setIsModalOpen(true);

  const handleConfirmOrder = async () => {
    try {
      await onConfirm();
    } catch (err: unknown) {
      console.error("Order confirmation failed:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Cart";
  }, []);

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Looks like you have not added any handcrafted blooms yet.</p>
        <Link href="/" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  const getLabelAndPrice = (item: SelectedProduct) => {
    if (item.selectedAddOnId) {
      const addOn = item.addOns?.find((a) => a.id === item.selectedAddOnId);
      return `${addOn?.label || "Default"} (${formatRs(addOn?.price || 0)})`;
    }
    return ` (${formatRs(item.price)})`;
  };

  const selectedPrice = (item: SelectedProduct) => {
    if (item.selectedAddOnId) {
      const addOn = item.addOns?.find((a) => a.id === item.selectedAddOnId);
      return addOn?.price || item.price;
    }
    return item.price;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-main">
          <div className="cart-heading">
            <h3>
              Shopping Cart{" "}
              <span>
                ({cart.items.length} {cart.items.length > 1 ? "items" : "item"})
              </span>
            </h3>
          </div>

          <div className="cart-grid">
            <section className="cart-items">
              {cart.items.map((item, i) => {
                return (
                  <article key={`item-${item.id}-${i}`} className="cart-item">
                    <div className="item-image-carousel">
                      <img
                        src={item.selectedImageUrl}
                        alt={item.name}
                        className="carousel-image fade-in"
                        key={`${item.id}-${item.selectedAddOnId}`}
                      />
                    </div>

                    <div className="item-content">
                      <div className="item-top">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="item-category">{item.category}</p>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>

                      <div className="packaging-selector">
                        {item.selectedAddOnId && (
                          <p className="selector-label">Package Options</p>
                        )}
                        <div className="radio-group">
                          <label className="radio-item active">
                            <input
                              type="radio"
                              name={`tier-${item.id}`}
                              value="tier1"
                              checked
                              readOnly
                            />
                            <span>{getLabelAndPrice(item)}</span>
                          </label>
                          <div className="item-quantity">
                            <button
                              onClick={() =>
                                updateCart({
                                  ...item,
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              }
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateCart({
                                  ...item,
                                  quantity: Math.min(10, item.quantity + 1),
                                })
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="item-footer">
                        <div className="item-price">
                          <p>
                            {item.name}: {item.quantity} x{" "}
                            {formatRs(selectedPrice(item))}
                          </p>
                          <p className="item-total-row">
                            <span>Item Total:</span>{" "}
                            <strong>{formatRs(item.subTotal ?? 0)}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="cart-summary">
              <div className="summary-card">
                <h2>Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatRs(cart.subTotal)}</span>
                </div>
                {cart.taxAmount > 0 && (
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>{formatRs(cart.taxAmount)}</span>
                  </div>
                )}
                {cart.shippingFee > 0 && (
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{formatRs(cart.shippingFee)}</span>
                  </div>
                )}
                {cart.discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-{formatRs(cart.discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatRs(cart.totalAmount)}</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div className="sustainability-note">
                  <span className="material-symbols-outlined">eco</span>
                  <p>
                    Your handcrafted stems support sustainable artistry and
                    reduction of floral waste.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <OrderConfirmation
          onClose={() => {
            setIsModalOpen(false);
            router.push("/");
          }}
          onConfirm={handleConfirmOrder}
          total={cart.totalAmount}
        />
      )}
    </div>
  );
};

export default CartPage;

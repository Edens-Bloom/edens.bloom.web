"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

const formatPrice = (value?: number) =>
  `Rs. ${Math.round(value ?? 0).toLocaleString("en-US")}`;

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateCart, clearCart, onConfirm } = useStore();

  const handleCheckout = async () => {
    try {
      await onConfirm();
      router.push("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page-shell flex min-h-[70vh] items-center justify-center">
        <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="eyebrow">Your cart</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Your cart is feeling a little empty.
          </h1>
          <p className="mt-4 text-slate-600">
            Add a bouquet or gift bundle to begin your floral experience.
          </p>
          <Link href="/" className="btn-primary mt-8 inline-flex">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Cart</p>
          <h1 className="section-title">Review your floral selection.</h1>
          <p className="mt-2 text-slate-600">
            Everything is ready for checkout and delivery.
          </p>
        </div>
        <button onClick={clearCart} className="btn-secondary inline-flex">
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={`${item.id}-${item.selectedAddOnId || 0}`}
              className="card flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <div className="h-32 min-w-[128px] overflow-hidden rounded-[1.5rem] bg-slate-100">
                <img
                  src={item.selectedImageUrl || item.imageUrl || "/next.svg"}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{item.category}</p>
                {item.selectedAddOnId ? (
                  <p className="mt-2 text-sm text-slate-700">
                    Selected option:{" "}
                    {
                      item.addOns?.find(
                        (addon) => addon.id === item.selectedAddOnId,
                      )?.label
                    }
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-lg font-semibold text-slate-900">
                  {formatPrice(item.subTotal)}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() =>
                      updateCart({
                        ...item,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center text-sm font-medium text-slate-700">
                    {item.quantity}
                  </span>
                  <button
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() =>
                      updateCart({ ...item, quantity: item.quantity + 1 })
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-sm font-semibold text-rose-600 hover:underline"
                  onClick={() => removeFromCart(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Order summary
          </h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(cart.taxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(cart.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- {formatPrice(cart.discountAmount)}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(cart.totalAmount)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="btn-primary mt-6 w-full justify-center"
          >
            Confirm order
          </button>
        </aside>
      </div>
    </div>
  );
}

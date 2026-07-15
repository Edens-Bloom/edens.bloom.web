"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

const formatPrice = (value?: number) =>
  `Rs. ${Math.round(value ?? 0).toLocaleString("en-US")}`;

export default function AdminProductsPage() {
  const { products, fetchProducts, isLoading, error } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1 className="section-title">Product management</h1>
          <p className="mt-2 text-slate-600">
            Review the boutique catalog and keep the storefront current.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          {products.length} products live
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading products...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="mb-4 h-52 overflow-hidden rounded-[1.5rem] bg-slate-100">
                <img
                  src={product.imageUrl || product.image_url || "/next.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{product.category}</span>
                {product.badge ? (
                  <span className="badge">{product.badge}</span>
                ) : null}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {product.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {product.description ||
                  "Curated floral styling for any occasion."}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {product.productType || "Bouquet"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

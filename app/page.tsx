"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

const formatPrice = (value?: number) =>
  `Rs. ${Math.round(value ?? 0).toLocaleString("en-US")}`;

export default function Home() {
  const { products, fetchProducts, isLoading } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="page-shell">
      <section className="hero-card">
        <div className="max-w-2xl">
          <p className="eyebrow">Handcrafted floral luxury</p>
          <h1>
            Fresh bouquets designed to feel personal, romantic, and
            unforgettable.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Discover premium stems, curated gift bundles, and one-of-a-kind
            arrangements created for every celebration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cart" className="btn-primary">
              Shop the collection
            </Link>
            <Link href="/about" className="btn-secondary">
              Our story
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="rounded-3xl bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
              Today&apos;s featured edit
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">
                  Signature bouquet
                </p>
                <p className="text-sm text-slate-600">
                  Premium roses with soft seasonal accents.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">
                  Gift-ready packaging
                </p>
                <p className="text-sm text-slate-600">
                  Elegant boxes, ribbons, and add-on options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-3xl font-semibold text-slate-900">24/7</p>
          <p className="mt-2 text-sm text-slate-600">
            Floral concierge support for urgent gifting plans.
          </p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-slate-900">100%</p>
          <p className="mt-2 text-sm text-slate-600">
            Crafted with fresh, premium flowers and thoughtful styling.
          </p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-slate-900">4.9/5</p>
          <p className="mt-2 text-sm text-slate-600">
            Rated by customers who return for every special moment.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">Featured bouquets</p>
            <h2 className="section-title">
              Pick a bloom that matches your moment.
            </h2>
          </div>
          <Link
            href="/cart"
            className="text-sm font-semibold text-rose-600 hover:underline"
          >
            View cart
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-600">
            Loading our latest arrangements...
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            Products will appear here as soon as they are added to the catalog.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <article key={product.id} className="card">
                <div className="mb-4 h-56 overflow-hidden rounded-[1.5rem] bg-slate-100">
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
                <h3 className="mt-3 text-xl font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description ||
                    "A carefully curated arrangement full of texture and charm."}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    href="/cart"
                    className="text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Add to cart
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-900 px-8 py-8 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-rose-200">Why Eden&apos;s Bloom</p>
            <h2 className="section-title text-white">
              Luxury, care, and impeccable presentation in every bouquet.
            </h2>
            <p className="mt-3 text-slate-300">
              From intimate dinners to milestone celebrations, we curate florals
              that bring depth, colour, and comfort to your table.
            </p>
          </div>
          <Link
            href="/about"
            className="btn-secondary bg-white text-slate-900 hover:bg-slate-100"
          >
            Learn more about us
          </Link>
        </div>
      </section>
    </div>
  );
}

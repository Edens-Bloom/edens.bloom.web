"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageOff, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Product, SelectedProduct } from "@/types";
import { formatRs } from "@/utils/formatRs";
import calculatePrice from "@/utils/calculatePrice";

type ProductCardProps = {
  product: Product;
  onViewDetail?: () => void;
};

const getDiscount = (product: Product) => {
  const originalPrice = Number(product.oldPrice ?? product.old_price ?? 0);
  if (!originalPrice || originalPrice <= product.price) return null;
  return Math.round(((originalPrice - product.price) / originalPrice) * 100);
};

export default function ProductCard({
  product,
  onViewDetail,
}: ProductCardProps) {
  const { addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const discount = getDiscount(product);
  const originalPrice = Number(product.oldPrice ?? product.old_price ?? 0);
  const reviewCount = product.reviews ?? 0;
  const category = product.category || product.productType || "Bouquet";

  const handleQuickAdd = () => {
    const selectedProduct = calculatePrice({
      ...product,
      selectedAddOnId: null,
      selectedAddOnPrice: 0,
      selectedImageUrl: product.imageUrl || product.image_url || "",
      quantity: 1,
      subTotal: product.price,
    } as SelectedProduct);
    addToCart(selectedProduct);
    setIsAdded(true);

    if (addedTimeoutRef.current) {
      clearTimeout(addedTimeoutRef.current);
    }

    addedTimeoutRef.current = setTimeout(() => {
      setIsAdded(false);
      addedTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current);
      }
    };
  }, []);

  return (
    <article className="product-card">
      <div className="product-card__media">
        {discount || product.isNew ? (
          <span className="product-card__badge">
            {discount ? `-${discount}%` : "New"}
          </span>
        ) : null}
        <Link
          href={`/products/${product.id}`}
          className="product-card__media-link"
        >
          {product.imageUrl ? (
            <Image
              className="product-card__image"
              src={product.imageUrl}
              alt={product.name}
              width={640}
              height={640}
              onError={(event) => {
                event.currentTarget.hidden = true;
                event.currentTarget.nextElementSibling?.removeAttribute(
                  "hidden",
                );
              }}
            />
          ) : (
            <span
              className="product-card__image-fallback"
              hidden={Boolean(product.imageUrl || product.image_url)}
            >
              <ImageOff size={26} strokeWidth={1.5} aria-hidden="true" />
            </span>
          )}
        </Link>
      </div>

      <div className="product-card__content">
        <span className="product-card__category">{category}</span>
        <h3 className="product-card__title" title={product.name}>
          {product.name}
        </h3>
        <div
          className="product-card__rating"
          aria-label={`${product.rating} out of 5 stars, ${reviewCount} reviews`}
        >
          <span className="product-card__stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={
                  index < Math.round(product.rating) ? "is-filled" : ""
                }
              >
                ★
              </span>
            ))}
          </span>
          <span>({reviewCount})</span>
        </div>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatRs(product.price)}</span>
          {discount ? (
            <span className="product-card__old-price">
              {formatRs(originalPrice)}
            </span>
          ) : null}
        </div>
        <div className="product-card__actions">
          <button
            type="button"
            className={`product-card__view-btn${isAdded ? " product-card__view-btn--added" : ""}`}
            onClick={onViewDetail}
            disabled={isAdded}
          >
            {isAdded ? "Added to cart" : "View detail"}
          </button>
          <button
            type="button"
            className="product-card__quick-add"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleQuickAdd}
          >
            <ShoppingBag size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

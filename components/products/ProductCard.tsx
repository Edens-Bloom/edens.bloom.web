"use client";

import Link from "next/link";
import { ImageOff, Heart, ShoppingBag } from "lucide-react";
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
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);
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
  };

  return (
    <article className="product-card">
      <div className="product-card__media">
        {discount || product.isNew ? (
          <span className="product-card__badge">
            {discount ? `-${discount}%` : "New"}
          </span>
        ) : null}
        <button
          type="button"
          className="product-card__wishlist"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <Link
          href={`/products/${product.id}`}
          className="product-card__media-link"
        >
          {product.imageUrl || product.image_url ? (
            <img
              src={product.imageUrl || product.image_url}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.hidden = true;
                event.currentTarget.nextElementSibling?.removeAttribute(
                  "hidden",
                );
              }}
            />
          ) : null}
          <span
            className="product-card__image-fallback"
            hidden={Boolean(product.imageUrl || product.image_url)}
          >
            <ImageOff size={26} strokeWidth={1.5} aria-hidden="true" />
          </span>
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
            className="product-card__view-btn"
            onClick={onViewDetail}
          >
            View detail
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

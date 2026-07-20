import type { SelectedProduct } from "../types";

/**
 * Calculates the unit price for a selected product based on whether an add-on is selected.
 * If an add-on is selected, it returns the add-on price. Otherwise, it returns the base product price.
 */
const calculatePrice = (
  product: Partial<SelectedProduct> & {
    price?: number;
    quantity?: number;
    selectedAddOnId?: number | null;
    selectedAddOnPrice?: number;
  },
): SelectedProduct => {
  const quantity = product.quantity ?? 1;
  const price = product.selectedAddOnId
    ? Number(product.selectedAddOnPrice ?? 0)
    : Number(product.price ?? 0);
  const subTotal = price * quantity;
  return { ...(product as SelectedProduct), quantity, subTotal } as SelectedProduct;
};

export default calculatePrice;

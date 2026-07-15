import db from "@/lib/db";

const formatProductNumber = (nextNumber: number): string => {
  return `EB-${String(nextNumber).padStart(4, "0")}`;
};

const extractNumericSuffix = (productNumber?: string): number => {
  if (!productNumber) return 0;
  const match = productNumber.match(/^EB-(\d{4})$/);
  return match ? parseInt(match[1], 10) : 0;
};

export const createProductNumber = async (): Promise<string> => {
  const latestProduct = await db("products")
    .whereNotNull("product_number")
    .orderBy("id", "desc")
    .first("product_number");

  const latestNumber = latestProduct
    ? extractNumericSuffix(latestProduct.product_number)
    : 0;

  return formatProductNumber(latestNumber + 1);
};

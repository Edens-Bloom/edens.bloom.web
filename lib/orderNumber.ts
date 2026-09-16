import db from "@/lib/db";

export const generateOrderNumber = async (): Promise<string> => {
  const result = await db("orders")
    .select(
      db.raw(
        "MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)) AS max_number",
      ),
    )
    .first();
  const nextNumber = Number(result?.max_number || 0) + 1;
  return `EBO-${String(nextNumber).padStart(5, "0")}`;
};

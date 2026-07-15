import db from "@/lib/db";

export const generateOrderNumber = async (): Promise<string> => {
  const result = await db("orders")
    .count<{ count: string }>("id as count")
    .first();
  const count = Number(result?.count || 0);
  const nextNumber = count + 1;
  return `EBO-${String(nextNumber).padStart(5, "0")}`;
};

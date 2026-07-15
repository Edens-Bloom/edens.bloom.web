import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSignedImageUrl } from "@/lib/cloudinary";
import { createProductNumber } from "@/lib/productNumber";

const formatProduct = (row: any) => ({
  id: row.id ?? null,
  name: row.name,
  price: Number(row.price),
  oldPrice: row.old_price ? Number(row.old_price) : undefined,
  category: row.category,
  productType: row.product_type ?? "others",
  imageUrl: getSignedImageUrl(row.image_url),
  badge: row.badge,
  rating: row.rating,
  reviews: row.reviews,
  description: row.description,
  icon: row.icon,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  productNumber: row.product_number,
});

export async function GET() {
  const rows = await db("products").select("*");
  const products = rows.map(formatProduct);
  return NextResponse.json({ status: "success", data: { products } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = body.name?.toString().trim();
  const category = body.category?.toString().trim();
  const price = Number(body.price ?? 0);

  if (!name || !category || Number.isNaN(price) || price <= 0) {
    return NextResponse.json(
      {
        status: "fail",
        message: "Product name, category, and price are required",
      },
      { status: 400 },
    );
  }

  const productNumber = await createProductNumber();
  const [created] = await db("products")
    .insert({
      product_number: productNumber,
      name,
      price,
      old_price: body.oldPrice ? Number(body.oldPrice) : null,
      category,
      product_type: body.productType || "others",
      image_url: body.imageUrl || null,
      badge: body.badge || null,
      rating: body.rating ? Number(body.rating) : 0,
      description: body.description || null,
    })
    .returning("*");

  const product = formatProduct(created);
  return NextResponse.json(
    { status: "success", data: { product } },
    { status: 201 },
  );
}

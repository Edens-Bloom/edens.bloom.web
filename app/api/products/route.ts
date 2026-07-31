import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSignedImageUrl } from "@/lib/cloudinary";
import { createProductNumber } from "@/lib/productNumber";

const getRequestBody = async (req: NextRequest) => {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    return Object.fromEntries(formData.entries()) as Record<string, unknown>;
  }

  const text = await req.text();
  if (!text) return {} as Record<string, unknown>;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
};

const formatProduct = (row: Record<string, unknown> | null | undefined) => {
  const productRow = (row ?? {}) as Record<string, unknown>;
  const imageUrl =
    typeof productRow.image_url === "string"
      ? productRow.image_url
      : typeof productRow.imageUrl === "string"
        ? productRow.imageUrl
        : undefined;

  return {
    id: productRow.id ?? null,
    name: typeof productRow.name === "string" ? productRow.name : "",
    price: Number(productRow.price ?? 0),
    oldPrice: productRow.old_price ? Number(productRow.old_price) : undefined,
    category:
      typeof productRow.category === "string" ? productRow.category : "",
    productType:
      typeof productRow.product_type === "string"
        ? productRow.product_type
        : "others",
    imageUrl: getSignedImageUrl(imageUrl),
    badge: typeof productRow.badge === "string" ? productRow.badge : undefined,
    rating: Number(productRow.rating ?? 5),
    reviews: Number(productRow.reviews ?? 0),
    description:
      typeof productRow.description === "string"
        ? productRow.description
        : undefined,
    icon: typeof productRow.icon === "string" ? productRow.icon : undefined,
    createdAt: productRow.created_at,
    updatedAt: productRow.updated_at,
    productNumber:
      typeof productRow.product_number === "string"
        ? productRow.product_number
        : undefined,
  };
};

export async function GET() {
  const rows = await db("products").select("*");
  const products = rows.map(formatProduct);
  return NextResponse.json({ status: "success", data: { products } });
}

export async function POST(req: NextRequest) {
  const body = await getRequestBody(req);
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

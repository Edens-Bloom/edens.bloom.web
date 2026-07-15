import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSignedImageUrl } from "@/lib/cloudinary";

type ProductRouteContext = {
  params?: Promise<{ id?: string | string[] | undefined }>;
};

const getProductId = async (
  params?: Promise<{ id?: string | string[] | undefined }>,
) => {
  const routeParams = await params;
  const idParam = routeParams?.id;
  return Number(Array.isArray(idParam) ? idParam[0] : idParam);
};

const formatAddon = (row: any) => ({
  id: row.addon_id,
  label: row.addon_label,
  price: Number(row.addon_price),
  is_default: row.addon_is_default,
  sort_order: row.addon_sort_order,
  image_url: getSignedImageUrl(row.addon_image_url),
});

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

export async function GET(req: NextRequest, { params }: ProductRouteContext) {
  const routeParams = await params;
  const idParam = routeParams?.id;
  const productId = Number(Array.isArray(idParam) ? idParam[0] : idParam);
  if (!productId) {
    return NextResponse.json(
      { status: "fail", message: "Product id required" },
      { status: 400 },
    );
  }

  const rows = await db("products as p")
    .leftJoin("product_addons as pa", "p.id", "pa.product_id")
    .where({ "p.id": productId })
    .select(
      "p.*",
      "pa.id as addon_id",
      "pa.label as addon_label",
      "pa.price as addon_price",
      "pa.is_default as addon_is_default",
      "pa.sort_order as addon_sort_order",
      "pa.is_active as addon_is_active",
      "pa.is_deleted as addon_is_deleted",
      "pa.image_url as addon_image_url",
    );

  if (!rows || rows.length === 0) {
    return NextResponse.json(
      { status: "fail", message: "Product not found" },
      { status: 404 },
    );
  }

  const product = {
    ...formatProduct(rows[0]),
    addOns: rows.filter((r) => r.addon_id != null).map(formatAddon),
  };

  return NextResponse.json({ status: "success", data: { product } });
}

export async function PUT(req: NextRequest, { params }: ProductRouteContext) {
  const productId = await getProductId(params);
  if (!productId) {
    return NextResponse.json(
      { status: "fail", message: "Product id required" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const updatePayload: Record<string, unknown> = {};

  if (body.name) updatePayload.name = body.name;
  if (body.category) updatePayload.category = body.category;
  if (body.price !== undefined) updatePayload.price = Number(body.price);
  if (body.oldPrice !== undefined)
    updatePayload.old_price = Number(body.oldPrice);
  if (body.productType) updatePayload.product_type = body.productType;
  if (body.imageUrl !== undefined) updatePayload.image_url = body.imageUrl;
  if (body.badge !== undefined) updatePayload.badge = body.badge;
  if (body.rating !== undefined) updatePayload.rating = Number(body.rating);
  if (body.description !== undefined)
    updatePayload.description = body.description;

  const [updated] = await db("products")
    .where({ id: productId })
    .update(updatePayload)
    .returning("*");

  if (!updated) {
    return NextResponse.json(
      { status: "fail", message: "Product not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: "success",
    data: { product: formatProduct(updated) },
  });
}

export async function DELETE(_: NextRequest, { params }: ProductRouteContext) {
  const productId = await getProductId(params);
  if (!productId) {
    return NextResponse.json(
      { status: "fail", message: "Product id required" },
      { status: 400 },
    );
  }

  const deleted = await db("products").where({ id: productId }).del();
  if (!deleted) {
    return NextResponse.json(
      { status: "fail", message: "Product not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "success", message: "Product deleted" });
}

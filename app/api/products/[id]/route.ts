import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSignedImageUrl } from "@/lib/cloudinary";
import { DBAddOns, DProduct, Product } from "@/types";

type ProductRouteContext = {
  params?: Promise<{ id?: string | string[] | undefined }>;
};

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

const getProductId = async (
  params?: Promise<{ id?: string | string[] | undefined }>,
) => {
  const routeParams = await params;
  const idParam = routeParams?.id;
  return Number(Array.isArray(idParam) ? idParam[0] : idParam);
};

const formatAddon = (row: DBAddOns) => {
  const addonRow = (row ?? {}) as DBAddOns;

  return {
    id: addonRow.id,
    label: addonRow.label,
    price: Number(addonRow.price),
    is_default: addonRow.is_default,
    sort_order: addonRow.sort_order,
    image_url: getSignedImageUrl(addonRow.image_url),
  };
};

const formatProduct = (row: DProduct) => {
  const productRow = (row ?? {}) as DProduct;

  return {
    id: productRow.id ?? null,
    name: productRow.name,
    price: Number(productRow.price),
    oldPrice: productRow.old_price ? Number(productRow.old_price) : undefined,
    category: productRow.category,
    productType: productRow.product_type ?? "others",
    imageUrl: getSignedImageUrl(productRow.image_url),
    badge: productRow.badge,
    rating: productRow.rating,
    reviews: productRow.reviews,
    description: productRow.description,
    icon: productRow.icon,
    createdAt: productRow.created_at,
    updatedAt: productRow.updated_at,
    productNumber: productRow.product_number,
  };
};

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
      "pa.id as id",
      "pa.label as label",
      "pa.price as price",
      "pa.is_default as is_default",
      "pa.sort_order as sort_order",
      "pa.is_active as is_active",
      "pa.is_deleted as is_deleted",
      "pa.image_url as image_url",
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

  const body = await getRequestBody(req);
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

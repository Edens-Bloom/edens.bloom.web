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

const formatAddon = (row: Record<string, unknown>) => {
  const addonRow = (row ?? {}) as Record<string, unknown>;

  return {
    id: addonRow.addon_id ?? addonRow.id,
    label: addonRow.addon_label ?? addonRow.label,
    price: Number(addonRow.addon_price ?? addonRow.price ?? 0),
    is_default: Boolean(addonRow.addon_is_default ?? addonRow.is_default),
    sort_order: Number(addonRow.addon_sort_order ?? addonRow.sort_order ?? 0),
    image_url: getSignedImageUrl(
      typeof addonRow.addon_image_url === "string"
        ? addonRow.addon_image_url
        : typeof addonRow.image_url === "string"
          ? addonRow.image_url
          : undefined,
    ),
  };
};

const formatProduct = (row: DProduct | Record<string, unknown>) => {
  const productRow = (row ?? {}) as Record<string, unknown>;

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
    imageUrl: getSignedImageUrl(
      typeof productRow.image_url === "string"
        ? productRow.image_url
        : typeof productRow.imageUrl === "string"
          ? productRow.imageUrl
          : undefined,
    ),
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

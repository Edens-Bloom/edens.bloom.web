import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import cloudinary, { getSignedImageUrl } from "@/lib/cloudinary";
import { DBAddOns, DProduct, Product } from "@/types";

const uploadFileToCloudinary = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "auto",
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          if (!uploadResult?.secure_url) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve(uploadResult as { secure_url: string });
        },
      );

      uploadStream.end(buffer);
    },
  );

  return result.secure_url;
};

type ProductRouteContext = {
  params?: Promise<{ id?: string | string[] | undefined }>;
};

const getRequestBody = async (req: NextRequest) => {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const parsedBody = Object.fromEntries(formData.entries()) as Record<
      string,
      unknown
    >;

    const uploadPromises = Array.from(formData.entries())
      .filter(([, value]) => value instanceof File)
      .map(async ([fieldName, value]) => {
        const uploadedUrl = await uploadFileToCloudinary(value as File);
        parsedBody[fieldName] = uploadedUrl;
      });

    await Promise.all(uploadPromises);
    return parsedBody;
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
  const productData = { ...body };

  const updatePayload: Record<string, unknown> = {};

  if (body.name !== undefined && String(body.name).trim())
    updatePayload.name = body.name;
  if (body.category !== undefined && String(body.category).trim())
    updatePayload.category = body.category;
  if (body.price !== undefined) updatePayload.price = Number(body.price);
  if (body.oldPrice !== undefined)
    updatePayload.old_price = Number(body.oldPrice);
  if (body.productType !== undefined && String(body.productType).trim())
    updatePayload.product_type = body.productType;
  if (body.badge !== undefined) updatePayload.badge = body.badge;
  if (body.rating !== undefined) updatePayload.rating = Number(body.rating);
  if (body.description !== undefined)
    updatePayload.description = body.description;
  if (body.inStock !== undefined) {
    updatePayload.in_stock = body.inStock === "true" || body.inStock === true;
  }
  if (typeof productData.mainImage === "string") {
    updatePayload.image_url = productData.mainImage;
  }

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

  const addons =
    typeof body.addons === "string"
      ? JSON.parse(body.addons)
      : Array.isArray(body.addons)
        ? body.addons
        : [];

  const updatedAddons: Array<Record<string, unknown>> = [];

  if (Array.isArray(addons) && addons.length > 0) {
    for (const addon of addons) {
      if (!addon || typeof addon !== "object") continue;

      const addonRecord = addon as Record<string, unknown>;

      if (addonRecord.tempId !== undefined && addonRecord.tempId !== null) {
        const [insertedAddon] = await db("product_addons")
          .insert({
            product_id: productId,
            label: addonRecord.label ?? null,
            price: addonRecord.price ? Number(addonRecord.price) : 0,
            is_default: Boolean(addonRecord.isDefault),
            sort_order: addonRecord.sortOrder
              ? Number(addonRecord.sortOrder)
              : 0,
            is_active: true,
            image_url:
              typeof productData[`addonImage_new_${addonRecord.tempId}`] ===
              "string"
                ? (productData[
                    `addonImage_new_${addonRecord.tempId}`
                  ] as string)
                : null,
          })
          .returning("*");

        updatedAddons.push(insertedAddon);
      } else {
        const [updatedAddon] = await db("product_addons")
          .where({ id: addonRecord.id, product_id: productId })
          .update({
            label: addonRecord.label ?? null,
            price: addonRecord.price ? Number(addonRecord.price) : 0,
            is_default: Boolean(addonRecord.isDefault),
            sort_order: addonRecord.sortOrder
              ? Number(addonRecord.sortOrder)
              : 0,
            is_active: true,
            updated_at: new Date(),
            image_url:
              typeof productData[`addonImage_${addonRecord.id}`] === "string"
                ? (productData[`addonImage_${addonRecord.id}`] as string)
                : typeof addonRecord.imageUrl === "string"
                  ? addonRecord.imageUrl
                  : null,
          })
          .returning("*");

        updatedAddons.push(updatedAddon);
      }
    }
  }

  const finalAddons = await db("product_addons")
    .where("product_id", productId)
    .andWhere("is_deleted", false)
    .select("*");

  return NextResponse.json({
    status: "success",
    data: {
      product: {
        ...formatProduct(updated),
        oldPrice: updated.old_price,
        inStock: updated.in_stock,
        addons: finalAddons,
      },
    },
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

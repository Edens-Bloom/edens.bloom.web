import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const unauthorized = () =>
  NextResponse.json(
    { status: "fail", message: "Authentication required" },
    { status: 401 },
  );

const getAuthenticatedUser = async (req: NextRequest) => {
  const user = await getCurrentUser(req);
  return user?.id ? user : null;
};

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorized();

  const rows = await db("wishlists")
    .where({ user_id: user.id })
    .select("product_id")
    .orderBy("created_at", "desc");

  return NextResponse.json({
    status: "success",
    data: {
      productIds: rows.map((row: { product_id: number }) => row.product_id),
    },
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const productId = Number(body.productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json(
      { status: "fail", message: "A valid productId is required" },
      { status: 400 },
    );
  }

  const product = await db("products").where({ id: productId }).first("id");
  if (!product) {
    return NextResponse.json(
      { status: "fail", message: "Product not found" },
      { status: 404 },
    );
  }

  await db("wishlists")
    .insert({ user_id: user.id, product_id: productId })
    .onConflict(["user_id", "product_id"])
    .ignore();

  return NextResponse.json({ status: "success" }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return unauthorized();

  const productId = Number(req.nextUrl.searchParams.get("productId"));
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json(
      { status: "fail", message: "A valid productId is required" },
      { status: 400 },
    );
  }

  await db("wishlists")
    .where({ user_id: user.id, product_id: productId })
    .delete();

  return NextResponse.json({ status: "success" });
}

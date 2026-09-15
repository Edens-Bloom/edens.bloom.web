import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { OrderStatus } from "@/types";

const allowedStatuses: OrderStatus[] = [
  "pending",
  "ordered",
  "confirmed",
  "delivered",
];

type OrderRouteContext = {
  params: Promise<{ id?: string }>;
};

export async function PATCH(req: NextRequest, { params }: OrderRouteContext) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { status: "fail", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const orderId = Number((await params).id);
  if (!orderId) {
    return NextResponse.json(
      { status: "fail", message: "Order id required" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const status = body.status as OrderStatus;
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { status: "fail", message: "Invalid order status" },
      { status: 400 },
    );
  }

  const [order] = await db("orders")
    .where({ id: orderId })
    .update({ status, updated_at: new Date() })
    .returning("*");

  if (!order) {
    return NextResponse.json(
      { status: "fail", message: "Order not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "success", data: { order } });
}

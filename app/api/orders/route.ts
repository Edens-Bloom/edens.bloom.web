import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/orderNumber";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user, cart } = body;

  if (!user || !user.phoneNumber) {
    return NextResponse.json(
      { status: "fail", message: "User phoneNumber is required" },
      { status: 400 },
    );
  }
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return NextResponse.json(
      { status: "fail", message: "Cart items are required" },
      { status: 400 },
    );
  }

  const phone = String(user.phoneNumber).trim();
  const name = user.name ? String(user.name).trim() : null;
  const email = user.email ? String(user.email).trim() : null;
  const address = user.address ? String(user.address).trim() : null;

  const existingCustomer = await db("customers").where({ phone }).first();
  let customer;

  if (existingCustomer) {
    [customer] = await db("customers")
      .where({ id: existingCustomer.id })
      .update({ name, email, address })
      .returning("*");
  } else {
    [customer] = await db("customers")
      .insert({ phone, name, email, address })
      .returning("*");
  }

  const orderNumber = await generateOrderNumber();
  const [order] = await db("orders")
    .insert({
      customer_id: customer.id,
      order_number: orderNumber,
      status: "pending",
      discount_amount: Number(cart.discountAmount || 0),
      shipping_fee: Number(cart.shippingFee || 0),
      tax_amount: Number(cart.taxAmount || 0),
      subtotal: Number(cart.subTotal || 0),
      total_amount: Number(cart.totalAmount || 0),
    })
    .returning("*");

  const orderItems = cart.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    package_id: null,
    addon_id: item.selectedAddOnId ?? null,
    buy_quantity: Number(item.quantity || 0),
    free_quantity: 0,
    total_quantity: Number(item.quantity || 0),
    price_at_order: Number(item.price ?? item.subTotal ?? 0),
    addon_price_at_order: Number(item.selectedAddOnPrice ?? 0),
    subtotal: Number(item.subTotal ?? 0),
  }));

  if (orderItems.length > 0) {
    await db("order_items").insert(orderItems);
  }

  return NextResponse.json(
    {
      status: "success",
      message: "Order confirmed successfully",
      data: { order },
    },
    { status: 201 },
  );
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { status: "fail", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const orders = await db("orders")
    .select(
      "orders.id",
      "orders.order_number",
      "orders.status",
      "orders.total_amount",
      "orders.subtotal",
      "orders.tax_amount",
      "orders.shipping_fee",
      "orders.discount_amount",
      "orders.created_at",
      "customers.id as customer_id",
      "customers.name",
      "customers.phone",
      "customers.email",
      "customers.address",
    )
    .leftJoin("customers", "orders.customer_id", "customers.id")
    .orderBy("orders.created_at", "desc");

  return NextResponse.json({ status: "success", data: { orders } });
}

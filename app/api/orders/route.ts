import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSignedImageUrl } from "@/lib/cloudinary";
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

  const orderIds = orders.map((order: { id: number }) => order.id);
  let ordersWithItems = orders;

  if (orderIds.length > 0) {
    const orderItems = await db("order_items")
      .select(
        "order_items.*",
        "products.name as product_name",
        "products.image_url",
        "product_addons.id as addon_record_id",
        "product_addons.label as addon_label",
        "product_addons.price as addon_price",
        "product_addons.image_url as addon_image_url",
      )
      .leftJoin("products", "order_items.product_id", "products.id")
      .leftJoin("product_addons", "order_items.addon_id", "product_addons.id")
      .whereIn("order_items.order_id", orderIds);

    const itemsByOrder: Record<number, Array<Record<string, unknown>>> = {};

    for (const item of orderItems) {
      const orderId = item.order_id as number;
      const itemWithImages = {
        ...item,
        image_url: getSignedImageUrl(item.image_url),
        addon: item.addon_record_id
          ? {
              id: item.addon_record_id,
              label: item.addon_label,
              price: item.addon_price,
              imageUrl: getSignedImageUrl(item.addon_image_url),
            }
          : null,
      };

      if (!itemsByOrder[orderId]) itemsByOrder[orderId] = [];
      itemsByOrder[orderId].push(itemWithImages);
    }

    ordersWithItems = orders.map((order: { id: number }) => ({
      ...order,
      items: itemsByOrder[order.id] || [],
    }));
  }

  return NextResponse.json({
    status: "success",
    data: { orders: ordersWithItems },
  });
}

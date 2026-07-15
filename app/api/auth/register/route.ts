import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = body.username?.toString().trim();
  const email = body.email?.toString().trim();
  const password = body.password?.toString();

  if (!username || !email || !password) {
    return NextResponse.json(
      { status: "fail", message: "Username, email, and password are required" },
      { status: 400 },
    );
  }

  const existing = await db("users").where({ username }).first();
  if (existing) {
    return NextResponse.json(
      { status: "fail", message: "Username already exists" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const [newUser] = await db("users")
    .insert({ username, email, password: hashedPassword, role: "admin" })
    .returning("*");

  return NextResponse.json({
    status: "success",
    data: { user: { ...newUser, password: undefined } },
  });
}

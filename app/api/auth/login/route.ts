import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = body.username?.toString().trim();
  const password = body.password?.toString();

  if (!username || !password) {
    return NextResponse.json(
      { status: "fail", message: "Username and password are required" },
      { status: 400 },
    );
  }

  const user = await db("users").where({ username }).first();
  if (!user || !(await bcrypt.compare(password, user.password || ""))) {
    return NextResponse.json(
      { status: "fail", message: "Incorrect username or password" },
      { status: 401 },
    );
  }

  const token = signToken(user.id);
  const sanitizedUser = { ...user, password: undefined };

  return NextResponse.json({
    status: "success",
    token,
    data: { user: sanitizedUser },
  });
}

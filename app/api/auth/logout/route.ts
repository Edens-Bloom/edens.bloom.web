import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "success" });
  response.cookies.set("bloom_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
  return response;
}

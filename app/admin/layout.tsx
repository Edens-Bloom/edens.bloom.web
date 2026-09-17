import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("bloom_token")?.value;

  if (!token) redirect("/login");

  try {
    const decoded = verifyToken(token);
    const user = await db("users").where({ id: decoded.id }).first();

    if (!user || user.role !== "admin") redirect("/login");
  } catch {
    redirect("/login");
  }

  return children;
}

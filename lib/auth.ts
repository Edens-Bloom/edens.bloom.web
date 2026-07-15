import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET: Secret = (process.env.JWT_SECRET || "secret") as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "90d") as SignOptions["expiresIn"];

export const signToken = (id: number) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: number };
};

export const getTokenFromRequest = (req: Request) => {
  const authorization = req.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;
  return authorization.split(" ")[1];
};

export const getCurrentUser = async (req: Request) => {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    const user = await db("users").where({ id: decoded.id }).first();
    return user || null;
  } catch {
    return null;
  }
};

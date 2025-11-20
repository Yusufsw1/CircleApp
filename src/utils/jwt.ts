import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface UserPayload {
  id: number;
  username: string;
}

export function signToken(payload: UserPayload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET tidak ditemukan di .env");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
}

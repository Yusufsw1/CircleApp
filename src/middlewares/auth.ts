import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        code: 401,
        status: "unauthorized",
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "unauthorized",
        message: "Token not provided",
      });
    }

    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      status: "unauthorized",
      message: "Invalid or expired token",
    });
  }
};

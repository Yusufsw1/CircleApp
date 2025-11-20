import { getThreads } from "../services/thread-service";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";

export async function listThread(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit) || 25;
    const currentUserId = (req as any).user.id;

    const threads = await getThreads(limit, currentUserId);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: { threads },
    });
  } catch (error) {
    next(error);
  }
}

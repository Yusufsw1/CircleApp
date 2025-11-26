import { getThreads, getThreadDetail } from "../services/thread-service";
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

export async function getThreadDetailController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const threadId = Number(req.params.id);
    const currentUserId = req.user.id;

    const thread = await getThreadDetail(threadId, currentUserId);

    if (!thread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: thread,
    });
  } catch (err) {
    next(err);
  }
}

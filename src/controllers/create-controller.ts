import { NextFunction, Response } from "express";
import { createThreadService } from "../services/create-service";
import { io } from "../app";
import { AuthRequest } from "../middlewares/auth";

export const createThreadController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const userId = (req as any).user.id;

    if (!content) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Invalid thread content",
      });
    }

    const image: string | null = req.file ? `uploads/${req.file.filename}` : null;

    const result = await createThreadService({
      content,
      image,
      user_id: userId,
    });
    io.emit("new-result", result);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Thread berhasil diposting.",
      data: {
        thread: {
          id: result.id,
          userid: result.user_id,
          user: {
            id: result.user.id,
            username: result.user.username,
            name: result.user.full_name,
            profile_picture: result.user.photo_profile,
          },
          content: result.content,
          image_url: result.image,
          timestamp: result.created_at,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid thread content",
    });
  }
};

import { NextFunction, Response } from "express";
import { createThreadService } from "../services/create-service";
import { AuthRequest } from "../middlewares/auth";
import { createThreadSchema } from "../validation/validation-auth";
import { io } from "../app";

export async function createThreadController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { error, value } = createThreadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error?.details?.[0]?.message || "Invalid request",
      });
    }

    const userId = req.user.id;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const result = await createThreadService({
      content: value.content,
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
      message: "Gagal membuat thread",
    });
  }
}

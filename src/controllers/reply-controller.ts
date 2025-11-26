import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../middlewares/auth";
import { getRepliesByThread } from "../services/reply-service";
import prisma from "../connection/client";
import { createReplySchema } from "../validation/validation-auth";
import { io } from "../app";

export async function getRepliesController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const threadId = Number(req.query.thread_id);
    const limit = Number(req.query.limit) || 25;

    if (!threadId) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "thread_id tidak boleh kosong",
      });
    }
    const replies = await getRepliesByThread(threadId, limit);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        replies,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createReplyController(req: Request, res: Response) {
  try {
    const thread_id = req.query.thread_id;
    const threadIdNum = Number(thread_id);

    if (!thread_id || isNaN(threadIdNum)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "thread_id harus berupa angka dan tidak boleh kosong",
      });
    }

    const { error, value } = createReplySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: error?.details?.[0]?.message || "Invalid request",
      });
    }

    const { content } = value;
    const image: string | null = req.file ? `uploads/${req.file.filename}` : null;
    const userId = (req as any).user.id;

    const reply = await prisma.replies.create({
      data: {
        thread_id: Number(thread_id),
        user_id: userId,
        content: content,
        image,
      },
      include: {
        user: true,
      },
    });
    const replyData = {
      id: reply.id,
      user_id: reply.user_id,
      content: reply.content,
      image: reply.image,
      created_at: reply.created_at.toISOString(), // ,
      user: {
        id: reply.user.id,
        username: reply.user.username,
        name: reply.user.full_name, // mapping disini
        profile_picture: reply.user.photo_profile,
      },
    };
    const totalReplies = await prisma.replies.count({
      where: { thread_id: Number(thread_id) },
    });

    // const io = getIO();
    // io.emit("new-reply", {
    //   reply: replyData,
    //   thread_id: Number(thread_id),
    //   replies_count: totalReplies,
    // });

    io.emit("new-reply", {
      reply: replyData,
      thread_id: Number(thread_id),
      replies_count: totalReplies,
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "reply berhasil diposting.",
      data: {
        replie: {
          id: reply.id,
          user_id: reply.user_id,
          content: reply.content,
          image: reply.image ? `uploads/${reply.image}` : null,
          timestamp: reply.created_at,
          replies_count: totalReplies,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid thread content",
    });
  }
}

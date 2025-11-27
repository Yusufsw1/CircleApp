// controllers/likes-controller.ts
import { Request, Response } from "express";
import prisma from "../connection/client";
import { AuthRequest } from "../middlewares/auth";
import { io } from "../app";

export async function likeThread(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const threadId = Number(req.body.thread_id);

    if (!threadId) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "thread_id tidak boleh kosong",
      });
    }

    // cek apakah thread ada
    const thread = await prisma.threads.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread tidak ditemukan",
      });
    }

    // cek apakah user sudah like
    const likeExist = await prisma.likes.findFirst({
      where: { user_id: userId, thread_id: threadId },
    });

    let action = "";
    let likeId = null;

    if (likeExist) {
      // UNLIKE
      await prisma.likes.delete({
        where: { id: likeExist.id },
      });
      action = "unliked";
    } else {
      // LIKE
      const newLike = await prisma.likes.create({
        data: {
          user_id: userId,
          thread_id: threadId,
          created_by: userId,
        },
      });
      likeId = newLike.id;
      action = "liked";
    }

    // total like terbaru
    const totalLikes = await prisma.likes.count({
      where: { thread_id: threadId },
    });

    io.emit("threadUpdated", {
      threadId,
      action,
      userId,
      is_liked: action === "liked",
      total_likes: totalLikes,
    });

    return res.json({
      code: 200,
      status: "success",
      message: `Thread ${action}`,
      data: {
        action,
        is_liked: action === "liked",
        like_id: likeId,
        total_likes: totalLikes,
      },
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal memproses like/unlike",
    });
  }
}

export async function getLikeStatus(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const { thread_id } = req.query;

    if (!thread_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "thread_id tidak boleh kosong",
      });
    }

    // Cek status like user untuk thread ini
    const userLike = await prisma.likes.findFirst({
      where: {
        user_id: userId,
        thread_id: Number(thread_id),
      },
    });

    // Hitung total likes
    const totalLikes = await prisma.likes.count({
      where: { thread_id: Number(thread_id) },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get like status successfully",
      data: {
        is_liked: !!userLike,
        like_id: userLike?.id,
        total_likes: totalLikes,
      },
    });
  } catch (error) {
    console.error("Get likes error:", error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal mendapatkan status like",
    });
  }
}

// controllers/likes-controller.ts
import { Request, Response } from "express";
import prisma from "../connection/client";
import { AuthRequest } from "../middlewares/auth";

export async function likeThread(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const { thread_id } = req.body;

    if (!thread_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "thread_id tidak boleh kosong",
      });
    }

    const threadIdNum = Number(thread_id);

    // Validasi apakah thread exists
    const thread = await prisma.threads.findUnique({
      where: { id: threadIdNum },
    });

    if (!thread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread tidak ditemukan",
      });
    }

    // Cek apakah user sudah like thread ini
    const existingLike = await prisma.likes.findFirst({
      where: {
        user_id: userId,
        thread_id: threadIdNum,
      },
    });

    let action: string;
    let likeResult;

    if (existingLike) {
      // Jika sudah like, maka UNLIKE (hapus like)
      await prisma.likes.delete({
        where: { id: existingLike.id },
      });
      action = "unliked";
    } else {
      // Jika belum like, maka LIKE (buat like baru)
      likeResult = await prisma.likes.create({
        data: {
          user_id: userId,
          thread_id: threadIdNum,
          created_by: userId,
        },
      });
      action = "liked";
    }

    // Hitung total likes untuk thread ini
    const totalLikes = await prisma.likes.count({
      where: { thread_id: threadIdNum },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: `Thread berhasil di${action}`,
      data: {
        action: action,
        is_liked: action === "liked",
        like_id: likeResult?.id || null,
        total_likes: totalLikes,
      },
    });
  } catch (error) {
    console.error("Like/Unlike error:", error);
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

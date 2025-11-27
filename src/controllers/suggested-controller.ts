import { Request, Response } from "express";
import { getSuggestedUsersService } from "../services/suggested-service";
import redis from "../connection/redis";

export async function getSuggestedUsersController(req: any, res: Response) {
  try {
    const user_id = req.user.id;
    const cacheKey = `suggested:${user_id}`;

    // 👉 cek cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "success",
        data: JSON.parse(cached),
      });
    }
    const users = await getSuggestedUsersService(user_id, 5);
    await redis.set(cacheKey, JSON.stringify(users), { EX: 120 });

    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch suggested users",
    });
  }
}

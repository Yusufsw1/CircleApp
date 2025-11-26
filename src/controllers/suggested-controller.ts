import { Request, Response } from "express";
import { getSuggestedUsersService } from "../services/suggested-service";

export async function getSuggestedUsersController(req: any, res: Response) {
  try {
    const user_id = req.user.id;
    const users = await getSuggestedUsersService(user_id, 5);

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

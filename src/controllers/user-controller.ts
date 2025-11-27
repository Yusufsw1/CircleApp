import { Request, Response } from "express";
import { searchUsersService } from "../services/user-service";

export async function searchUsersController(req: any, res: Response) {
  try {
    const { query } = req.query;
    const user_id = req.user.id;

    if (!query || query.trim() === "") {
      return res.status(200).json({ users: [] });
    }

    const users = await searchUsersService(query, user_id);

    return res.status(200).json({ users });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Search failed" });
  }
}

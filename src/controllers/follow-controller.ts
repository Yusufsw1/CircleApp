import { Request, Response } from "express";
import { getFollowersService, getFollowingService, followUserService, unfollowUserService, countFollowData } from "../services/follow-service";
import { io } from "../app";

export async function getFollowsController(req: any, res: Response) {
  try {
    const { type } = req.query;
    const user_id = req.user.id;

    if (type === "followers") {
      const followers = await getFollowersService(user_id);
      return res.status(200).json({ status: "success", data: { followers } });
    }

    if (type === "following") {
      const following = await getFollowingService(user_id);
      return res.status(200).json({ status: "success", data: { following } });
    }

    return res.status(400).json({ status: "error", message: "Query 'type' must be followers or following" });
  } catch (err: any) {
    console.error("getFollowsController:", err);
    return res.status(500).json({ status: "error", message: "Failed to fetch follow data" });
  }
}

export async function followUserController(req: any, res: Response) {
  try {
    const follower_id = req.user.id;
    const { followed_user_id } = req.body;
    if (!followed_user_id) return res.status(400).json({ status: "error", message: "followed_user_id is required" });

    const created = await followUserService(follower_id, Number(followed_user_id));
    if (!created) return res.status(200).json({ status: "success", message: "Already following", data: { user_id: followed_user_id, is_following: true } });

    const countsForActor = await countFollowData(follower_id);
    const countsForTarget = await countFollowData(Number(followed_user_id));

    // emit two events with explicit type so frontend can update correct counters
    io.emit("follow-changed", { user_id: follower_id, type: "following", ...countsForActor });
    io.emit("follow-changed", { user_id: Number(followed_user_id), type: "followers", ...countsForTarget });

    return res.status(200).json({ status: "success", message: "You have successfully followed the user.", data: { user_id: followed_user_id, is_following: true } });
  } catch (err: any) {
    console.error("followUserController:", err);
    return res.status(500).json({ status: "error", message: "Failed to follow the user." });
  }
}

export async function unfollowUserController(req: any, res: Response) {
  try {
    const follower_id = req.user.id;
    const { followed_id } = req.body;
    if (!followed_id) return res.status(400).json({ status: "error", message: "followed_id is required" });

    const removed = await unfollowUserService(follower_id, Number(followed_id));
    const countsForActor = await countFollowData(follower_id);
    const countsForTarget = await countFollowData(Number(followed_id));

    io.emit("follow-changed", { user_id: follower_id, type: "following", ...countsForActor });
    io.emit("follow-changed", { user_id: Number(followed_id), type: "followers", ...countsForTarget });

    return res.status(200).json({ status: "success", message: "You have successfully unfollowed the user.", data: { user_id: followed_id, is_following: false } });
  } catch (err: any) {
    console.error("unfollowUserController:", err);
    return res.status(500).json({ status: "error", message: "Failed to unfollow the user." });
  }
}

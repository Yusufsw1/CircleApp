// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth";
// import { likeThreadService, unlikeThreadService } from "../services/like-service";
// import { io } from "../app";

// export async function likeThreadController(req: AuthRequest, res: Response) {
//   try {
//     const thread_id = req.query.thread_id;
//     const user_id = req.user.id;

//     if (!thread_id) {
//       return res.status(400).json({ error: "thread_id is required" });
//     }

//     const result = await likeThreadService({
//       thread_id: Number(thread_id),
//       user_id,
//     });

//     io.emit("like-updated", {
//       thread_id,
//       likes: result.totalLikes,
//     });

//     return res.status(200).json({
//       message: "Thread liked successfully",
//       likes: result.totalLikes,
//     });
//   } catch (err: any) {
//     return res.status(400).json({ error: err.message });
//   }
// }

// export async function unlikeThreadController(req: AuthRequest, res: Response) {
//   try {
//     const thread_id = req.body.thread_id || req.query.thread_id;
//     const user_id = req.user.id;

//     if (!thread_id) {
//       return res.status(400).json({ error: "thread_id is required" });
//     }

//     const result = await unlikeThreadService({
//       thread_id: Number(thread_id),
//       user_id,
//     });

//     return res.status(200).json({
//       message: "Thread unliked successfully",
//       likes: result.totalLikes,
//     });
//   } catch (err: any) {
//     return res.status(400).json({ error: err.message });
//   }
// }

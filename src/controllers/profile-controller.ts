import { Request, Response } from "express";
import { getProfileService, updateProfileService } from "../services/profile-service";
import { io } from "../app";
import { log } from "node:console";

export async function getProfileController(req: any, res: Response) {
  try {
    const user_id = req.user.id;
    const profile = await getProfileService(user_id);

    return res.status(200).json(profile);
  } catch (err: any) {
    return res.status(404).json({ message: err.message || "Profile not found" });
  }
}

export async function updateProfileController(req: any, res: Response) {
  try {
    const user_id = req.user.id;
    const { full_name, bio } = req.body;

    // Siapkan payload
    const payload: any = {
      user_id,
      full_name,
      bio,
    };

    // Jika ada foto baru, baru masukkan ke payload
    if (req.file) {
      payload.photo_profile = `uploads/${req.file.filename}`;
    }

    const updated = await updateProfileService(payload);
    const updatedProfile = await getProfileService(user_id);

    // realtime
    io.emit("profile-updated", updatedProfile);

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth";
import { registerSchema, loginSchema } from "../validation/validation-auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 500,
        status: "Eror",
        message: "Invalid register",
      });
    }

    const result = await registerUser(value);
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Registrasi berhasil. Akun berhasil dibuat",
      data: {
        user_id: result.user.id,
        username: result.user.username,
        name: result.user.full_name,
        email: result.user.email,
        token: result.token,
      },
    });
  } catch (err) {
    return res.status(400).json({
      code: 500,
      status: "Eror",
      message: "Invalid register",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
      });
    }

    const result = await loginUser(value);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful.",
      data: {
        user_id: result.user.id,
        username: result.user.username,
        name: result.user.full_name,
        email: result.user.email,
        avatar: result.user.photo_profile,
        token: result.token,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Invalid Login",
    });
  }
};

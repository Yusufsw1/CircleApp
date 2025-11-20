import prisma from "../connection/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";

export async function registerUser(data: { username: string; name: string; email: string; password: string }) {
  const { username, name, email, password } = data;

  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.users.create({
    data: {
      username,
      full_name: name,
      email,
      password: hashed,
    },
  });

  const token = signToken({
    id: user.id,
    username: user.username,
  });

  return {
    user,
    token,
  };
}

export async function loginUser(data: { identifier: string; password: string }) {
  const { identifier, password } = data;

  const user = await prisma.users.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    throw new Error("Invalid Login");
  }

  const validPassword = await comparePassword(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid Login");
  }

  const token = signToken({
    id: user.id,
    username: user.username,
  });

  return { user, token };
}

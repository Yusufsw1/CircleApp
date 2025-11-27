import prisma from "../connection/client";

export async function likeThreadService(user_id: number, thread_id: number) {
  const exist = await prisma.likes.findFirst({
    where: { user_id, thread_id },
  });

  if (exist) return null; // sudah like

  await prisma.likes.create({
    data: { user_id, thread_id },
  });

  const count = await prisma.likes.count({ where: { thread_id } });

  return {
    thread_id,
    totalLikes: count,
    is_liked: true,
  };
}

export async function unlikeThreadService(user_id: number, thread_id: number) {
  await prisma.likes.deleteMany({
    where: { user_id, thread_id },
  });

  const count = await prisma.likes.count({ where: { thread_id } });

  return {
    thread_id,
    totalLikes: count,
    is_liked: false,
  };
}

export async function isUserLikedThread(user_id: number, thread_id: number) {
  const exist = await prisma.likes.findFirst({
    where: { user_id, thread_id },
  });

  return !!exist;
}

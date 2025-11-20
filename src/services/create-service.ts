import prisma from "../connection/client";

interface CreateThreadInput {
  user_id: number;
  content: string;
  image?: string | null;
}

export async function createThreadService(data: CreateThreadInput) {
  return await prisma.threads.create({
    data: {
      content: data.content,
      image: data.image ?? null,
      user_id: data.user_id,
      created_by: data.user_id,
    },
    select: {
      // ✅ TAMBAH SEMUA FIELD THREAD YANG DIBUTUHKAN
      id: true,
      content: true,
      image: true,
      created_at: true,
      user_id: true,
      // ✅ User relation dengan field yang dibutuhkan
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
          // Jangan include password, email, dll
        },
      },
    },
  });
}

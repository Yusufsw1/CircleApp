import prisma from "../connection/client";

export async function searchUsersService(query: string, current_user_id: number) {
  const search = query.toLowerCase();

  // cari user berdasarkan username atau nama
  const results = await prisma.users.findMany({
    where: {
      OR: [{ username: { contains: search, mode: "insensitive" } }, { full_name: { contains: search, mode: "insensitive" } }],
    },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
    },
    take: 10,
  });

  // cek apakah user login sudah follow mereka
  const alreadyFollowed = await prisma.follow.findMany({
    where: { follower_id: current_user_id },
    select: { following_id: true },
  });

  const followingSet = new Set(alreadyFollowed.map((f) => f.following_id));

  return results.map((user) => ({
    ...user,
    is_following: followingSet.has(user.id),
  }));
}

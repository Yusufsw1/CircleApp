import prisma from "../connection/client";

export async function getSuggestedUsersService(current_user_id: number, limit = 5) {
  // id user yang sudah difollow
  const followings = await prisma.follow.findMany({
    where: { follower_id: current_user_id },
    select: { following_id: true },
  });

  const followingIds = followings.map((f) => f.following_id);

  // ambil user random yang bukan diri sendiri & belum difollow
  const suggestedUsers = await prisma.users.findMany({
    where: {
      NOT: {
        id: {
          in: [...followingIds, current_user_id], // exclude diri sendiri + user yg sudah difollow
        },
      },
    },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
    },
    take: limit,
  });

  return suggestedUsers.map((u) => ({
    id: u.id,
    username: u.username,
    full_name: u.full_name,
    photo_profile: u.photo_profile,
    is_following: false,
  }));
}

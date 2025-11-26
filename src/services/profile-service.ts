import prisma from "../connection/client";

export async function getProfileService(user_id: number) {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
      bio: true,
    },
  });

  if (!user) throw new Error("User not found");
  const follower_count = await prisma.follow.count({
    where: { following_id: user_id },
  });

  // Hitung following -> siapa yg saya follow
  const following_count = await prisma.follow.count({
    where: { follower_id: user_id },
  });

  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    photo_profile: user.photo_profile,
    bio: user.bio,
    follower_count,
    following_count,
  };
}

export async function updateProfileService({ user_id, full_name, bio, photo_profile }: { user_id: number; full_name?: string; bio?: string; photo_profile?: string }) {
  const updated = await prisma.users.update({
    where: { id: user_id },
    data: {
      ...(full_name && { full_name }),
      ...(bio && { bio }),
      ...(photo_profile && { photo_profile }),
      updated_by: user_id,
    },
  });

  return updated;
}

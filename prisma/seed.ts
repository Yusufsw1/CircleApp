// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//   console.log("🌱 Starting seed...");

//   // THREADS
//   const threads = await prisma.threads.createMany({
//     data: [
//       {
//         content: "Hari ini aku belajar React + Clean Architecture! 🔥",
//         image: null,
//         number_of_replies: 2,
//         user_id: 1, // pastikan user id 1 ada!
//       },
//       {
//         content: "Tailwind + Shadcn UI bikin UI jadi cepet banget! 💨",
//         image: null,
//         number_of_replies: 1,
//         user_id: 2,
//       },
//       {
//         content: "Backend pakai Express + Prisma itu enak banget ga bohong 🤯",
//         image: null,
//         number_of_replies: 4,
//         user_id: 1,
//       },
//       {
//         content: "Belajar Clean Architecture itu wajib kalau mau scalable! 📚",
//         image: null,
//         number_of_replies: 0,
//         user_id: 3,
//       },
//       {
//         content: "Ini thread contoh terakhir untuk Uji Coba FE kamu 😎",
//         image: null,
//         number_of_replies: 2,
//         user_id: 2,
//       },
//     ],
//   });

//   console.log("🌱 Thread seeded.");

//   // LIKE (optional)
//   await prisma.likes.createMany({
//     data: [
//       // thread 1 dilike user 2 & 3
//       { thread_id: 1, user_id: 2 },
//       { thread_id: 1, user_id: 3 },

//       // thread 2 dilike user 1
//       { thread_id: 2, user_id: 1 },

//       // thread 3 dilike user 1 & 2
//       { thread_id: 3, user_id: 1 },
//       { thread_id: 3, user_id: 2 },
//     ],
//   });

//   console.log("🌱 Likes seeded.");

//   // REPLIES (optional)
//   await prisma.replies.createMany({
//     data: [
//       {
//         content: "Mantap bang! lanjutkan belajar clean architecture 🔥",
//         thread_id: 1,
//         user_id: 2,
//       },
//       {
//         content: "React emang keren si!",
//         thread_id: 1,
//         user_id: 3,
//       },
//       {
//         content: "Betul bro, shadcn UI enak sih",
//         thread_id: 2,
//         user_id: 1,
//       },
//       {
//         content: "Tos bang, sama-sama pakai Express + Prisma 😎",
//         thread_id: 3,
//         user_id: 2,
//       },
//     ],
//   });

//   console.log("🌱 Replies seeded.");
// }

// main()
//   .catch((e) => console.error("❌ Seeding error:", e))
//   .finally(async () => await prisma.$disconnect());

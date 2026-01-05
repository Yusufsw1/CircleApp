# ⭕ CircleApp - Real-time Social Networking Platform

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**CircleApp** is a high-performance social networking platform built for instantaneous community engagement. By leveraging **WebSockets**, the application provides a seamless, real-time experience where users can interact, share, and connect without the need for manual refreshes.

## ✨ Real-time Features

- **Instant Social Feed**: Experience real-time post updates, likes, and comments powered by **Socket.io**.
- **Live Notifications**: Get notified instantly when someone follows you or interacts with your content.
- **Bi-directional Communication**: Low-latency data exchange between client and server for a snappy, app-like feel.
- **Advanced Social Graph**: Robust follow/unfollow system with a complex Many-to-Many relational schema in **PostgreSQL**.
- **Secure Authentication**: Implementation of JWT-based auth to protect user privacy and data integrity.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite) & Tailwind CSS / Chakra UI.
- **Backend**: Node.js & Express.js.
- **Real-time Engine**: Socket.io.
- **Database**: PostgreSQL (Relational Database).
- **ORM**: Prisma / Sequelize (Optional, mention if used).
- **State Management**: React Query / TanStack Query for efficient server-state handling.

## 📂 System Architecture

```text
├── client/          # React Vite Frontend
│   ├── src/components
│   ├── src/hooks    # Custom hooks for Socket events
│   └── src/services # API Integration
└── server/          # Express.js Backend
    ├── controllers  # Business logic
    ├── socket/      # Socket.io event handlers
    └── models/      # PostgreSQL Schema definitions
```

🚀 Getting Started
1. Setup Backend
   ```bash
   cd server
   npm install
   # Configure your .env (DATABASE_URL, JWT_SECRET, etc.)
   npm run dev

2. Setup Frontend
   ```bash
   cd client
   npm install  
   npm run dev

💡 Engineering Highlights: Real-time Sync
"The biggest challenge was ensuring data consistency between the PostgreSQL database and the connected Socket clients. I implemented a robust event-handling system where every database write triggers a specific socket broadcast, ensuring all users in a 'Circle' see the same data at the same millisecond."

🤝 Contact
Yusuf - [GitHub Profile](https://github.com/Yusufsw1)

Project Link: https://[github.com/Yusufsw1/CircleApp](https://github.com/Yusufsw1/CircleApp)

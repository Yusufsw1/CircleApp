import { createContext } from "react";

export type User = {
  id: number;
  username: string;
  name: string;
  full_name?: string;
  profile_picture: string | null;
};

export type Thread = {
  id: number;
  content: string;
  user_id: number;
  image?: string | null;
  created_at: string;
  user: User;
};

export type ThreadContextType = {
  threads: Thread[];
  addThread: (t: Thread) => void;
  loadThreads: () => Promise<void>;
};

export const ThreadContext = createContext<ThreadContextType | null>(null);

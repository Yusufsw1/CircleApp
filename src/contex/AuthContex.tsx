import { createContext } from "react";

export type User = {
  user_id: number;
  username: string;
  name: string;
  email: string;
  avatar?: string | null;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  register: (data: { username: string; name: string; email: string; password: string }) => Promise<void>;
  login: (data: { identifier: string; password: string }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

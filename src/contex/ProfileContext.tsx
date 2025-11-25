import type { User } from "@/types/Type";
import { createContext } from "react";

type ProfileContextType = {
  profile: User | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<any>;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

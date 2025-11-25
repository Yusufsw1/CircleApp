import { ProfileContext } from "@/contex/ProfileContext";
import { useContext } from "react";

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("ProfileContext must be used within ProfileProvider");
  return ctx;
};

import { useContext } from "react";
import { createContext } from "react";
import type { UserContextType } from "./UserProvider";

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
export const UserContext = createContext<UserContextType | undefined>(undefined);

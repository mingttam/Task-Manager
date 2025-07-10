// Create LoginContext to manage login state
import { createContext } from "react";

// Define User type to match TaskManager
export interface User {
  token: string;
  // Add more fields if needed
}

export const LoginContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

import { useState, type ReactNode } from "react";
import { UserContext } from "./context";

export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

export interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  return <UserContext.Provider value={{ users, addUser }}>{children}</UserContext.Provider>;
};

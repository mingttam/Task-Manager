import { BrowserRouter, Route, Routes } from "react-router";
import AccessDenied from "./pages/AccessDenied";
import Login from "./pages/Login";
import AssigneeMe from "./pages/AssigneeMe";
import CreateTask from "./pages/CreateTask";
import Tasks from "./pages/Tasks";
import UpdateTask from "./pages/UpdateTask";
import { useState, useEffect } from "react";
import { LoginContext } from "./context";

// Define a User type for clarity
interface User {
  token: string;
  // Add more fields if you decode the token or fetch user info
}

const TaskManager = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Restore user from localStorage if available
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />

          {user && <Route path="/access-denied" element={<AccessDenied />} />}
          {user && <Route path="/assignee-me" element={<AssigneeMe />} />}
          {user && <Route path="/create-task" element={<CreateTask />} />}
          {user && <Route path="/tasks" element={<Tasks />} />}
          {user && <Route path="/update-task" element={<UpdateTask />} />}
          <Route path="*" element={<AccessDenied />} />
        </Routes>
      </BrowserRouter>
    </LoginContext.Provider>
  );
};

export default TaskManager;

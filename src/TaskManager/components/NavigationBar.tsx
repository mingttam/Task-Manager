import { useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { LoginContext } from "../context";
import LogOut from "./LogOut";

export default function NavigationBar() {
  const { user } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateTask = () => {
    navigate("/create-task");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              TaskManager
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate("/tasks")}
              className={`group relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActiveRoute("/tasks")
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span>All Tasks</span>
              </div>
              {isActiveRoute("/tasks") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => navigate("/assignee-me")}
              className={`group relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActiveRoute("/assignee-me")
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md border border-purple-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>My Tasks</span>
              </div>
              {isActiveRoute("/assignee-me") && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Create Task Button */}
            <button
              onClick={handleCreateTask}
              className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">Create Task</span>
                <span className="sm:hidden">Create</span>
              </span>
            </button>

            {/* Logout Button */}
            <LogOut />
          </div>

          {/* Mobile Menu Button (for future expansion) */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => navigate("/tasks")}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isActiveRoute("/tasks")
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span>All Tasks</span>
            </button>

            <button
              onClick={() => navigate("/assignee-me")}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isActiveRoute("/assignee-me")
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>My Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

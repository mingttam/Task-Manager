import { useContext } from "react";
import { useNavigate } from "react-router";
import { LoginContext } from "../context";

const LogOut = () => {
  const { setUser } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="group px-4 py-2.5 bg-white text-gray-700 rounded-xl border-2 border-gray-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:border-red-300 hover:text-red-600"
    >
      <span className="flex items-center space-x-2">
        <svg
          className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="hidden lg:inline">Logout</span>
      </span>
    </button>
  );
};

export default LogOut;

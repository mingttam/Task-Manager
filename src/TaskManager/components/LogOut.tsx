import { useContext } from "react";
import { useNavigate } from "react-router";
import { LoginContext } from "../context";

const LogOut = () => {
  const { setUser } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded shadow transition duration-200"
    >
      Log Out
    </button>
  );
};

export default LogOut;

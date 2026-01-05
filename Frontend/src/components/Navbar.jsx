import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black text-white">
      <Link to="/" className="text-xl font-bold">
        SkillEngine
      </Link>

      <div className="space-x-4 flex items-center">
        {!loggedIn ? (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300">
              👋 {user?.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

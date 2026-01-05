import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuth } from "../utils/auth";

export default function GoogleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      // ✅ Save complete user object
      const user = {
        name: decodeURIComponent(name || "User"),
        email: decodeURIComponent(email || "")
      };
      saveAuth(token, user);
      navigate("/");
    } else {
      // If no token, redirect to login
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-lg">Logging you in...</p>
      </div>
    </div>
  );
}
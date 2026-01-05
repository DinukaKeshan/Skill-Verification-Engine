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

    if (token) {
      saveAuth(token, { name });
      navigate("/");
    }
  }, [location, navigate]);

  return <div className="text-center mt-20">Logging you in...</div>;
}

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { logout } from "../utils/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true); // Fix 4: guard against pre-hydration renders

  // Restore auth state from localStorage on mount — runs exactly once
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // Normalize: older sessions or OAuth flows may store 'id' instead of '_id'
        if (parsed && !parsed._id && parsed.id) {
          parsed._id = parsed.id;
        }

        if (!parsed?._id) {
          console.warn("AuthContext: stored user is missing _id — clearing stale session", parsed);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setUser(parsed);
          setAuthenticated(true);
          console.log("AuthContext: restored user from localStorage:", parsed);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setInitializing(false); // always mark done, even if nothing was restored
  }, []);

  // Fix 1: useCallback makes function references stable across renders,
  // preventing GoogleRedirect's useEffect from re-running on every render.
  const login = useCallback((userData) => {
    setAuthenticated(true);
    setUser(userData);
  }, []);

  const logoutUser = useCallback(() => {
    logout(); // clears both "token" and "user" from localStorage
    setAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authenticated, login, logoutUser, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

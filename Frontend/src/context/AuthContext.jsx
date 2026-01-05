import { createContext, useContext, useState, useEffect } from "react";
import { getUser, isAuthenticated } from "../utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
      setUser(getUser());
    }
  }, []);

  const login = (userData) => {
    setAuthenticated(true);
    setUser(userData);
  };

  const logoutUser = () => {
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authenticated, login, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

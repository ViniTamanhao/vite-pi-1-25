import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface AuthContextType {
  token: string | null;
  login: (name: string, pwd: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load token from localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("tokenPSICOUFRJ");
    const expiration = localStorage.getItem("tokenExpirationPSICOUFRJ");

    if (storedToken && expiration) {
      const now = Date.now();
      if (now < parseInt(expiration)) {
        setToken(storedToken);
      } else {
        logout();
      }
    }
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;

    const expiration = localStorage.getItem("tokenExpirationPSICOUFRJ");
    if (expiration) {
      const expTime = parseInt(expiration);
      const now = Date.now();
      const timeout = setTimeout(() => {
        logout();
      }, expTime - now);

      return () => clearTimeout(timeout);
    }
  }, [token]);

  const login = async (name: string, pwd: string) => {
    try {
      const response = await api.post("/login", { name, pwd });
      const { token } = response.data;

      if (token) {
        const expiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        localStorage.setItem("tokenPSICOUFRJ", token);
        localStorage.setItem("tokenExpirationPSICOUFRJ", expiration.toString());
        setToken(token);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("tokenPSICOUFRJ");
    localStorage.removeItem("tokenExpirationPSICOUFRJ");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useContext(AuthContext);

  return token ? children : <Navigate to="/" />;
}

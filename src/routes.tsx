import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/auth";

// Pages
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";

const AppRoutes = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

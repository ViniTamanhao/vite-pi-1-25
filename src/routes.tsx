import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/auth";

// Pages
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Pacientes from "./pages/Pacientes/Pacientes";
import Alunos from "./pages/Alunos/Alunos";
import Pareceres from "./pages/Pareceres/Pareceres";
import Setores from "./pages/Setores/Setores";
import CreateParecerAlunoPage from "./pages/FormularioPareceres/FormularioPareces";

const AppRoutes = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {token ? (
        <>
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/pareceres" element={<Pareceres />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/*" element={<Home />} />
        </>
      ) : (
        <Route path="/*" element={<Login />} />
      )}

      <Route path="/formparecer" element={<CreateParecerAlunoPage />} />
    </Routes>
  );
};

export default AppRoutes;

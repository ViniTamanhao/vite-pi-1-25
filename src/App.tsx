import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./context/auth";
import AppRoutes from "./routes";
import GlobalStyles from "./styles/global";

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

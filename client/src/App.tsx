import { useRoutes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import routes from "./routes";

function App() {
  const element = useRoutes(routes);
  return (
    <AuthProvider>
      <Header />
      {element}
      <Footer />
    </AuthProvider>
  );
}

export default App;

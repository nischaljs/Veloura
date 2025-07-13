import { useRoutes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import routes from "./routes";
import { Toaster } from 'sonner';

function App() {
  const element = useRoutes(routes);
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" richColors closeButton />
        <Header />
        {element}
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

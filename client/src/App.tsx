import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import RegisterWithBusinessForm from "./components/auth/RegisterWithBusinessForm";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";

const routes = [
  {
    path: '/',
    element: <LandingPage/>,
    children: [],
  },
  {
    path: '/register-business',
    element: <RegisterWithBusinessForm/>,
    children: [],
  },
  {
    path: '/register',
    element: <RegisterForm/>,
    children: [],
  },
  {
    path: '/login',
    element: <LoginForm/>,
    children: [],
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage/>,
    children: [],
  },
  {
    path: '/search',
    element: <SearchResultsPage/>,
    children: [],
  },
];

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

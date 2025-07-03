import { useRoutes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const routes = [
  {
    path: '/',
    element: <LandingPage/>,
    children: [],
  }
  // {
  //   path: '/login',
  //   element: <LoginForm />,
  //   children: [],
  // },
  // {
  //   path: '/register',
  //   element: <RegisterForm />,
  //   children: [],
  // },
];

function App() {
  const element = useRoutes(routes);
  return (
    <>
      <Header />
      {element}
      <Footer />
    </>
  );
}

export default App;

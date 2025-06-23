import { useRoutes, Link } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import './App.css';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Veloura</h1>
      <div className="flex gap-4">
        <Link to="/login" className="underline text-blue-600">Login</Link>
        <Link to="/register" className="underline text-blue-600">Register</Link>
      </div>
      </div>
  );
}

const routes = [
  {
    path: '/',
    element: <Home />,
    children: [],
  },
  {
    path: '/login',
    element: <LoginForm />,
    children: [],
  },
  {
    path: '/register',
    element: <RegisterForm />,
    children: [],
  },
];

function App() {
  const element = useRoutes(routes);
  return element;
}

export default App;

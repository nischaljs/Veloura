import { Component } from 'react';
import type { ReactNode } from 'react';
import { useRoutes } from "react-router-dom";
import { Toaster } from 'sonner';
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import routes from "./routes";

// ErrorBoundary component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700">
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-white p-4 rounded shadow text-left max-w-xl overflow-x-auto">{String(this.state.error)}</pre>
          <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const element = useRoutes(routes);
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" richColors closeButton />
          <Header />
          {element}
          <Footer />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

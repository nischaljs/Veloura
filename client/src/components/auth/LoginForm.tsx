import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

interface LoginFormValues {
  identifier: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      identifier: '',
      password: '',
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, user } = useAuth();

  // Refactored: useEffect for redirect after login
  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        navigate(redirect, { replace: true });
        return;
      }
      switch (user.role) {
        case 'CUSTOMER':
          navigate('/dashboard', { replace: true });
          break;
        case 'VENDOR':
          navigate('/vendor/dashboard', { replace: true });
          break;
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, loading, location, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.identifier, values.password);
    // No redirect here; handled in useEffect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2">
          {/* <img src="/logo192.png" alt="Logo" className="w-12 h-12 mb-2" /> */}
          <span className="text-4xl font-extrabold text-indigo-700 mb-2">Veloura</span>
          <CardTitle className="text-3xl font-extrabold text-center">Sign in to Veloura</CardTitle>
          <CardDescription className="text-center">Welcome back! Please enter your credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email or phone" autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <div className="text-center text-sm mt-2">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
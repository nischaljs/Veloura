import React, { useState } from 'react';
import { Button } from './ui/button';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: Record<string, string>) => void;
  loading?: boolean;
  error?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, loading, error }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    identifier: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onSubmit({ identifier: form.identifier, password: form.password });
    } else {
      onSubmit({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-900 rounded shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode === 'login' ? 'Login' : 'Register'}</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {mode === 'login' ? (
        <>
          <input
            type="text"
            name="identifier"
            placeholder="Email or Phone"
            value={form.identifier}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </>
      ) : (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
      </Button>
    </form>
  );
}; 
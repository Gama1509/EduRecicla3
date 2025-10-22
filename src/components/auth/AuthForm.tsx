// @/components/auth/AuthForm.tsx
"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  isRegister?: boolean;
}

const AuthForm = ({ isRegister = false }: AuthFormProps) => {
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate auth logic
    login();
    alert(`Simulating ${isRegisterMode ? 'registration' : 'login'}... Redirecting...`);
    // In a real app, you'd redirect here
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        {isRegisterMode ? 'Create an Account' : 'Welcome Back'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {isRegisterMode && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
              placeholder="John Doe"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary-600 transition-colors"
        >
          {isRegisterMode ? 'Register' : 'Login'}
        </button>

        <p className="mt-6 text-center text-gray-600">
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="ml-2 text-secondary font-semibold hover:underline"
          >
            {isRegisterMode ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;

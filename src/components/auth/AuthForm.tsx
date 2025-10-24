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
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8 text-center">
        {isRegisterMode ? 'Create an Account' : 'Welcome Back'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-md">
        {isRegisterMode && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border-dark dark:focus:ring-secondary-dark"
              placeholder="John Doe"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border-dark dark:focus:ring-secondary-dark"
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border-dark dark:focus:ring-secondary-dark"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary-hover transition-colors dark:bg-secondary-dark dark:hover:bg-secondary-dark-hover"
        >
          {isRegisterMode ? 'Register' : 'Login'}
        </button>

        <p className="mt-6 text-center text-text-secondary-light dark:text-text-secondary-dark">
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="ml-2 text-secondary dark:text-secondary-dark font-semibold hover:underline"
          >
            {isRegisterMode ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;

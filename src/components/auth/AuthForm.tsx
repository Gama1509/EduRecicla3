"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { glowColors } from '@/constants/glowColors';

interface AuthFormProps {
  isRegister?: boolean;
}

// Simulación de usuarios registrados
const testUsers = [
  { name: 'User One', email: 'user1@example.com', password: 'password1', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { name: 'User Two', email: 'user2@example.com', password: 'password2', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
];

const AuthForm = ({ isRegister = false }: AuthFormProps) => {
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);
  const { login } = useAuth();
  const router = useRouter();

  const glowColor = glowColors[0]; // Siempre el primer color

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Admin check
    if (email === 'admin@example.com' && password === 'Nnt60029051+') {
      login({ name: 'Admin', email }); // Admin sin avatar
      router.push('/admin');
      return;
    }

    // Verificar usuarios de prueba
    const user = testUsers.find(u => u.email === email && u.password === password);
    if (user) {
      login(user); // Pasar usuario con avatar
      router.push('/');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid credentials',
        text: 'The email or password is incorrect',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-md border border-black dark:border-white transition-colors duration-300">
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8 text-center">
        {isRegisterMode ? 'Create an Account' : 'Welcome Back'}
      </h1>

      <form className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-lg border border-black dark:border-white transition-colors duration-300" onSubmit={handleSubmit}>
        {isRegisterMode && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              required
            className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john.doe@example.com"
            required
            className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            required
            className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-black dark:text-white font-bold py-3 px-6 rounded-lg border border-black dark:border-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_var(--glow-color)] cursor-pointer"
          style={{ '--glow-color': glowColor } as any}
        >
          {isRegisterMode ? 'Register' : 'Login'}
        </button>

        <p className="mt-6 text-center text-text-secondary-light dark:text-text-secondary-dark">
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="ml-2 text-secondary dark:text-secondary-dark font-semibold hover:underline transition duration-200"
          >
            {isRegisterMode ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;

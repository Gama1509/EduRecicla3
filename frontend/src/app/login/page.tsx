'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { access_token } = await res.json();
      localStorage.setItem('token', access_token);
      router.push('/admin/products');
    } else {
      // Handle error
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300">
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">Login</h1>
        <div className="mb-4">
          <label className="block text-text-primary-light dark:text-text-primary-dark mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark"
          />
        </div>
        <div className="mb-4">
          <label className="block text-text-primary-light dark:text-text-primary-dark mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-secondary dark:bg-secondary-dark font-bold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer text-black dark:text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}

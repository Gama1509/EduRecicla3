'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import { glowColors } from '@/constants/glowColors';

interface AuthFormProps {
  isRegister?: boolean;
}
interface Avatar {
  id: string;
  image: string; // Base64
}

const AuthForm = ({ isRegister = false }: AuthFormProps) => {
  const [isRegisterMode, setIsRegisterMode] = useState(isRegister);
  const { login } = useAuth();
  const router = useRouter();
  const glowColor = glowColors[0];

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Traer avatares desde backend solo si estamos en modo registro
  useEffect(() => {
    if (isRegisterMode) {
      const fetchAvatars = async () => {
        try {
          const res = await api.get('/avatar'); // endpoint que retorna [{id, image}]
          setAvatars(res.data);
        } catch (err) {
          console.error('Error al cargar avatares:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los avatares. Intenta de nuevo más tarde.',
            confirmButtonColor: '#2563eb',
          });
        }
      };
      fetchAvatars();
    }
  }, [isRegisterMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      let response;
      let data;

      if (isRegisterMode) {
        if (!selectedAvatar) {
          return Swal.fire({
            icon: 'error',
            title: 'Select an avatar',
            text: 'Please choose an avatar before registering.',
            confirmButtonColor: '#2563eb',
          });
        }

        const response = await api.post('/auth/register', {
          name,
          email,
          password,
          avatarId: selectedAvatar, // enviamos solo el id
        });
        const data = response.data;

        // Éxito: mostrar mensaje
        await Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'Te has registrado y se ha iniciado sesión automáticamente.',
          confirmButtonColor: '#2563eb',
        });

        login(
          {
            uuid: data.uuid,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
          },
          data.access_token
        );

        router.push(data.role === 'admin' ? '/admin' : '/');
      } else {
        // Login
        response = await api.post('/auth/login', { email, password });
        data = response.data;

        login(
          {
            uuid: data.uuid,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
          },
          data.access_token
        );

        await Swal.fire({
          icon: 'success',
          title: 'Logged in successfully',
          confirmButtonColor: '#2563eb',
        });

        router.push(data.role === 'admin' ? '/admin' : '/');
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Unknown error',
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
          <>
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

            <div className="mb-4">
              <label className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">Select Avatar</label>
              <div className="grid grid-cols-4 gap-3">
                {avatars.map((avt, index) => {
                  const glow = selectedAvatar === avt.id ? 'rgba(255,0,0,0.7)' : glowColors[index % glowColors.length];
                  return (
                    <img
                      key={avt.id}
                      src={`data:image/png;base64,${avt.image}`}
                      alt={`Avatar ${avt.id}`}
                      className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all duration-200 hover:scale-105`}
                      style={{
                        borderColor: selectedAvatar === avt.id ? 'red' : 'transparent',
                        boxShadow: selectedAvatar === avt.id ? `0 0 12px ${glow}` : undefined,
                      }}
                      onClick={() => setSelectedAvatar(avt.id)}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.boxShadow = `0 0 12px ${glow}`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        if (selectedAvatar === avt.id) {
                          el.style.boxShadow = `0 0 12px ${glow}`; // mantiene el rojo si está seleccionado
                        } else {
                          el.style.boxShadow = '';
                        }
                      }}
                    />
                  );
                })}
              </div>

            </div>
          </>
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
          style={{ '--glow-color': glowColor } as React.CSSProperties}
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

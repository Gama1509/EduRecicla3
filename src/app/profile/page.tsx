'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Botón reutilizable con glow y subrayado
interface GlowingButtonProps {
  text: string;
  glowColor: string;
  onClick: () => void;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ text, glowColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hover:scale-105 transition-all duration-300 text-text-primary-light dark:text-text-primary-dark font-semibold text-left"
      style={{ "--glow-color": glowColor, textShadow: "0 0 0px transparent" } as React.CSSProperties}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.textShadow = `0 0 8px var(--glow-color)`;
        el.style.textDecoration = "underline";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.textShadow = "0 0 0px transparent";
        el.style.textDecoration = "none";
      }}
    >
      {text}
    </button>
  );
};

const UserProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (!user) return null; // Evitar errores si no hay sesión

  return (
    <div className="max-w-4xl mx-auto bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-lg border border-black dark:border-white transition-colors duration-300 space-y-8">

      {/* ====================== AVATAR Y DATOS ====================== */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-secondary shadow-md">
          <Image
            src={
              user.avatar.startsWith("data:image")
                ? user.avatar
                : `data:image/png;base64,${user.avatar}`
            }
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold mt-4 text-text-primary-light dark:text-text-primary-dark">
          {user.name}
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          {user.email}
        </p>
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
          Rol: <span className="font-semibold capitalize">{user.role}</span>
        </p>
      </div>

      {/* ====================== BOTONES EN 2 COLUMNAS ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ====================== COMPRADOR / DONADOR ====================== */}
        <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
            🛒 Como comprador / donador
          </h3>

          <div className="flex flex-col gap-3">
            <GlowingButton
              text="En los que estoy interesado"
              glowColor="rgba(255,200,0,0.7)"
              onClick={() => handleNavigate("/profile/buyer/interested")}
            />
            <GlowingButton
              text="Ventas / donaciones en proceso"
              glowColor="rgba(0,200,255,0.7)"
              onClick={() => handleNavigate("/profile/buyer/in-progress")}
            />
            <GlowingButton
              text="Completadas (recibí el artículo)"
              glowColor="rgba(0,255,150,0.7)"
              onClick={() => handleNavigate("/profile/buyer/completed")}
            />
            <GlowingButton
              text="Canceladas (yo como comprador)"
              glowColor="rgba(255,100,100,0.7)"
              onClick={() => handleNavigate("/profile/buyer/cancelled")}
            />
          </div>
        </div>

        {/* ====================== VENDEDOR / DONADOR ====================== */}
        <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
            💼 Como vendedor / donador
          </h3>

          <div className="flex flex-col gap-3">
            <GlowingButton
              text="Gente interesada en mis productos"
              glowColor="rgba(255,200,0,0.7)"
              onClick={() => handleNavigate("/profile/seller/interested")}
            />
            <GlowingButton
              text="Ventas / donaciones en proceso"
              glowColor="rgba(0,200,255,0.7)"
              onClick={() => handleNavigate("/profile/seller/in-progress")}
            />
            <GlowingButton
              text="Completadas (ya entregué el artículo)"
              glowColor="rgba(0,255,150,0.7)"
              onClick={() => handleNavigate("/profile/seller/completed")}
            />
            <GlowingButton
              text="Canceladas (yo como vendedor)"
              glowColor="rgba(255,100,100,0.7)"
              onClick={() => handleNavigate("/profile/seller/cancelled")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

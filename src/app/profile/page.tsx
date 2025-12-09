'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const UserProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (!user) return null; // Evitar errores si no hay sesión

  return (
    <div className="max-w-4xl mx-auto bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-lg border border-black dark:border-white transition-colors duration-300 space-y-8 mt-8">

      {/* ====================== AVATAR Y DATOS ====================== */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-secondary shadow-md">
          <img
            src={
              user.avatar && user.avatar.startsWith("http")
                ? user.avatar
                : "/default-avatar.png"
            }
            alt={user.name || "User Avatar"}
            className="w-full h-full object-cover rounded-full"
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

      {/* ====================== ENLACES EN 2 COLUMNAS ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ====================== COMPRADOR / DONADOR ====================== */}
        <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
            🛒 Como comprador / donador
          </h3>

          <div className="flex flex-col gap-3">
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,200,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/interested")}
            >
              En los que estoy interesado
            </span>
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,200,0,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/in-progress")}
            >
              Ventas / donaciones en proceso
            </span>

            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,255,150,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/delivered")}
            >
              Recibidos (ya recibí el artículo)
            </span>

            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,255,150,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/completed")}
            >
              Completadas (ya marque de recibido)
            </span>
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,100,100,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/cancelled-in-progress")}
            >
              Canceladas (yo cancele como comprador cuando estaba en progreso)
            </span>
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,100,100,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/cancelled-interested")}
            >
              Canceladas (yo cancele mi interés en el producto)
            </span>
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,100,100,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/buyer/rejected")}
            >
              Rechazadas (rechazaron mi interés)
            </span>
          </div>
        </div>

        {/* ====================== VENDEDOR / DONADOR ====================== */}
        <div className="bg-background-light dark:bg-background-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
            💼 Como vendedor / donador
          </h3>

          <div className="flex flex-col gap-3">
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,200,0,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/interested")}
            >
              Gente interesada en mis productos
            </span>
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,200,255,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/in-progress")}
            >
              Ventas / donaciones en proceso
            </span>

            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,255,150,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/delivered")}
            >
              Entregadas (ya entregué el artículo)
            </span>

            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(0,255,150,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/completed")}
            >
              Completadas (el comprador ya marco de recibido)
            </span>

            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,100,100,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/cancelled")}
            >
              Canceladas (yo he cancelado como vendedor)
            </span>
            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,100,100,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/rejected")}
            >
              Rechazadas (yo rechace interesados)
            </span>

            <span
              role="link"
              tabIndex={0}
              className="block cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
              style={{ textShadow: '0 0 0px transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 8px rgba(255,100,100,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '0 0 0px transparent';
              }}
              onClick={() => handleNavigate("/profile/seller/cancelled-interested")}
            >
              Gente que ha cancelado su interes en mis productos
            </span>
          </div>
        </div>
      </div>
      <div
        role="link"
        tabIndex={0}
        className="mt-6 bg-background-light dark:bg-background-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-inner col-span-2 text-center cursor-pointer font-semibold text-white transition-all duration-300 hover:underline hover:font-bold hover:scale-105"
        style={{ textShadow: "0 0 0px transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textShadow = "0 0 8px rgba(255,100,100,0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textShadow = "0 0 0px transparent";
        }}
        onClick={() => handleNavigate("/profile/my-products")}
      >
        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          📦 Mis productos
        </h3>
      </div>

    </div>
  );
};

export default UserProfilePage;

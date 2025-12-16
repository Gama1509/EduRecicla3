"use client";

import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function withAuth<T extends object>(
  Component: ComponentType<T>,
  requireLogin: boolean = true, // 👈 exige login o no
  onlyAdmin: boolean = false,   // 👈 exclusivo para admin
  onlyGuest: boolean = false    // 👈 exclusivo para visitantes (no logueados), por defecto false
) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const { isLoggedIn, user } = useAuth();
    const [ready, setReady] = useState(false);

    useEffect(() => {
      setReady(true);

      // 🔒 Caso: solo admin
      if (onlyAdmin) {
        if (!isLoggedIn || user?.role !== "admin") {
          router.replace("/"); // 👈 rebota a raíz
          return;
        }
        return; // admin logueado entra
      }

      // 🟢 Caso: solo visitantes (no logueados)
      if (onlyGuest) {
        if (isLoggedIn) {
          if (user?.role === "admin") {
            router.replace("/admin");
          } else {
            router.replace("/dashboard");
          }
          return;
        }
        return; // visitante entra
      }

      // 🔵 Páginas que requieren login
      if (requireLogin) {
        if (!isLoggedIn) {
          router.replace("/login");
          return;
        }
        if (user?.role === "admin") {
          router.replace("/admin"); // 👈 admin logueado va a /admin
          return;
        }
        return; // usuario normal logueado entra
      }

      // 🟡 Páginas públicas
      if (!requireLogin) {
        if (user?.role === "admin") {
          router.replace("/admin"); // 👈 admin logueado va a /admin
          return;
        }
        return; // público o usuario normal entra
      }
    }, [isLoggedIn, user, requireLogin, onlyAdmin, onlyGuest, router]);

    if (!ready) {
      return (
        <div className="flex h-screen items-center justify-center">
          Cargando...
        </div>
      );
    }

    return <Component {...props} />;
  };
}

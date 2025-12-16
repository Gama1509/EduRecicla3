'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

export const useApiInterceptor = () => {
    const router = useRouter();
    const { logout, isLoggedIn } = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error?.response?.status;

                if ([401, 403, 500].includes(status)) {
                    let title = "Error";
                    let text = "Ocurrió un problema inesperado.";

                    if (status === 401) {
                        if (isLoggedIn) {
                            title = "Sesión finalizada";
                            text = "Tu sesión ha caducado, vuelve a iniciar sesión.";
                        } else {
                            title = "No autorizado";
                            text = "Debes iniciar sesión para continuar.";
                        }
                    } else if (status === 403) {
                        if (isLoggedIn) {
                            title = "Sesión finalizada";
                            text = "No tienes permisos, vuelve a iniciar sesión.";
                        } else {
                            title = "Acceso denegado";
                            text = "No tienes permisos para acceder, inicia sesión.";
                        }
                    } else if (status === 500) {
                        title = "Error del servidor";
                        text = "Estamos teniendo problemas internos, intenta más tarde.";
                    }

                    Swal.fire({
                        icon: "warning",
                        title,
                        text,
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        if (isLoggedIn) {
                            logout(); // 👈 solo si estaba logueado
                        }
                        router.push("/"); // 👈 siempre redirige a raíz
                    });

                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [router, logout, isLoggedIn]);
};

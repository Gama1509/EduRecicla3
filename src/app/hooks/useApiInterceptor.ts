'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

export const useApiInterceptor = () => {
    const router = useRouter();
    const { logout } = useAuth(); // ⬅️ usamos logout

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error?.response?.status;

                // 🔴 Si es error 401 o 500 => cerrar sesión
                if (status === 401 || status === 500) {
                    console.log('Error 401 o 500');
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión finalizada',
                        text: 'Por seguridad, vuelve a iniciar sesión.',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        logout();        // limpia todo
                        router.push('/');
                    });

                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [router, logout]);
};

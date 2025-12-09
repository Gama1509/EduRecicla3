'use client';

import { useApiInterceptor } from "@/app/hooks/useApiInterceptor";


export default function ApiInterceptorProvider() {
    useApiInterceptor();
    return null; // no renderiza nada, solo activa el interceptor
}

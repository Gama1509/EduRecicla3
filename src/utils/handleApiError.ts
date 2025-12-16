import Swal from "sweetalert2";

export function handleApiError(error: any, customMessage?: string) {
  const status = error?.response?.status;

  // Errores ya manejados por el interceptor (sesión, permisos, server error)
  if ([401, 403, 500].includes(status)) {
    return;
  }

  // Intenta obtener mensaje del backend
  const backendMessage =
    error?.response?.data?.message ||
    error?.message ||
    null;

  Swal.fire({
    icon: "error",
    title: "Error",
    text: backendMessage || customMessage || "Ocurrió un error inesperado.",
  });
}

// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket) return socket; // evita múltiples conexiones
  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
  console.log("🔌 Socket conectado");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("❌ Socket desconectado");
  }
};

export const getSocket = () => socket;

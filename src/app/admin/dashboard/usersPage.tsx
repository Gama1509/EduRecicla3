"use client";

import User from "@/types/user";
import api from "@/utils/api";
import { useEffect, useState } from "react";
interface UsersPageProps {
  onBack: () => void;
}

const glowColors = ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.15)"];

export default function UsersPage({ onBack }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await api.get("/users"); // api es instancia de axios
        console.log(res.data);
        setUsers(res.data); // los datos están en res.data
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);


  if (loading) {
    return (
      <div className="col-span-full p-8 text-white text-center">
        Cargando usuarios...
      </div>
    );
  }



  return (
    <div className="col-span-full p-8 space-y-8 rounded-lg transition-colors duration-300">
      <h2 className="text-3xl font-bold text-white text-center">Usuarios</h2>
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded font-semibold text-white bg-black border border-white hover:shadow-[0_0_10px_yellow] transition-all"
        >
          ← Volver al Dashboard
        </button>
      </div>
      {/* Número total de usuarios */}
      <div className="p-6 bg-black/80 rounded shadow text-center text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
        <p className="font-medium">Total de usuarios</p>
        <p className="text-2xl font-bold mt-2">{users.length}</p>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto bg-black/80 rounded shadow p-6 border border-white hover:shadow-[0_0_15px_white] transition-all">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              {["Nombre", "Email", "Rol", "Creado"].map((th) => (
                <th key={th} className="py-2 px-4 text-left border-b border-white">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={idx}
                className="transition-all cursor-pointer"
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 15px ${glowColors[idx % glowColors.length]}`;
                  el.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "";
                  el.style.transform = "";
                }}
              >
                <td className="py-2 px-4 border-b border-white">{user.name}</td>
                <td className="py-2 px-4 border-b border-white">{user.email}</td>
                <td className="py-2 px-4 border-b border-white">{user.role}</td>
                <td className="py-2 px-4 border-b border-white">
                  {new Date(user.createdAt).toLocaleDateString('es-MX')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
}

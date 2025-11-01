"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AdminAction {
  admin: string;
  product: string;
  action: "Approved" | "Rejected";
  reason: string;
  created_at: string;
}

interface AdminActionsPageProps {
  onBack: () => void;
}

// Datos de ejemplo
const actions: AdminAction[] = [
  { admin: "Maria Lopez", product: "Laptop X1", action: "Approved", reason: "Valid info", created_at: "2025-10-01" },
  { admin: "Carlos Gomez", product: "PC Gamer", action: "Rejected", reason: "Incomplete data", created_at: "2025-10-02" },
  { admin: "Maria Lopez", product: "Laptop Y2", action: "Approved", reason: "Valid info", created_at: "2025-10-03" },
];

const COLORS = ["#00C49F", "#FF8042"];
const glowColors = ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.15)"];

export default function AdminActionsPage({ onBack }: AdminActionsPageProps) {
  const totalActions = actions.length;
  const approvedCount = actions.filter(a => a.action === "Approved").length;
  const rejectedCount = actions.filter(a => a.action === "Rejected").length;

  const chartData = [
    { name: "Approved", count: approvedCount },
    { name: "Rejected", count: rejectedCount },
  ];

  const latestActions = [...actions].sort((a, b) => (b.created_at > a.created_at ? 1 : -1)).slice(0, 3);

  return (
    <div className="col-span-full p-8 space-y-8 rounded-lg transition-colors duration-300">
      <h2 className="text-3xl font-bold text-white text-center">Acciones de Admin</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-black/80 rounded shadow text-center text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
          <p className="font-medium">Total de acciones</p>
          <p className="text-2xl font-bold mt-2">{totalActions}</p>
        </div>
        <div className="p-6 bg-black/80 rounded shadow text-center text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
          <p className="font-medium">Aprobadas</p>
          <p className="text-2xl font-bold mt-2">{approvedCount}</p>
        </div>
        <div className="p-6 bg-black/80 rounded shadow text-center text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
          <p className="font-medium">Rechazadas</p>
          <p className="text-2xl font-bold mt-2">{rejectedCount}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-black/80 rounded shadow p-6 text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
        <p className="text-center font-medium mb-4">Acciones aprobadas vs rechazadas</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {chartData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'white' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Últimas acciones */}
      <div className="p-6 bg-black/80 rounded shadow text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
        <p className="font-medium mb-2 text-center">Últimas acciones realizadas</p>
        <ul className="list-disc pl-6">
          {latestActions.map((a, idx) => (
            <li key={idx}>{a.admin} - {a.product} ({a.action}) - {a.reason}</li>
          ))}
        </ul>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-black/80 rounded shadow p-6 border border-white hover:shadow-[0_0_15px_white] transition-all">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              {["Admin", "Producto", "Acción", "Motivo", "Fecha"].map((th) => (
                <th key={th} className="py-2 px-4 text-left border-b border-white">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actions.map((a, idx) => (
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
                <td className="py-2 px-4 border-b border-white">{a.admin}</td>
                <td className="py-2 px-4 border-b border-white">{a.product}</td>
                <td className="py-2 px-4 border-b border-white">{a.action}</td>
                <td className="py-2 px-4 border-b border-white">{a.reason}</td>
                <td className="py-2 px-4 border-b border-white">{a.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón Volver */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded font-semibold text-white bg-black border border-white hover:shadow-[0_0_10px_yellow] transition-all"
        >
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  );
}

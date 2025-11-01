"use client";
import { useEffect, useState } from "react";
import { glowColors } from "@/constants/glowColors";
import api from "@/utils/api"; // tu instancia de axios
import UsersPage from "./dashboard/usersPage";
import ProductsPage from "./dashboard/productsPage";
import TransactionsPage from "./dashboard/transactionsPage";
import { AdminDashboard } from "@/types/admin-dashboard";

export default function AdminDashboardPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await api.get<AdminDashboard>("/admin/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const renderSection = () => {
    switch (selectedSection) {
      case "users":
        return <UsersPage onBack={() => setSelectedSection(null)} />;
      case "products":
        return <ProductsPage onBack={() => setSelectedSection(null)} />;
      case "transactions":
        return <TransactionsPage onBack={() => setSelectedSection(null)} />;

      default:
        return null;
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando dashboard...</p>;
  if (!dashboardData) return <p className="text-center mt-8">No se pudo cargar la información.</p>;

  const dashboardCards = [
    { title: "Total Users", value: dashboardData.totalUsers, key: "users" },
    { title: "Total Products", value: dashboardData.totalProducts, key: "products" },
    { title: "Total Transactions", value: dashboardData.totalTransactions, key: "transactions" },
  ];

  return (
    <div>
      <h1 className="text-5xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4 text-center">
        Admin Dashboard
      </h1>
      <h2 className="text-2xl text-text-primary-light dark:text-text-primary-dark mb-8 text-center">
        Resumen general
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedSection ? (
          <div className="col-span-full">{renderSection()}</div>
        ) : (
          dashboardCards.map((card, index) => {
            const cardGlow = glowColors[index % glowColors.length];
            return (
              <div
                key={index}
                className="border rounded-lg shadow-lg bg-card-light dark:bg-card-dark p-6 flex flex-col items-start transition-transform transform hover:-translate-y-2 hover:shadow-[0_0_20px_var(--glow-color)] h-full cursor-pointer"
                style={{ "--glow-color": cardGlow } as React.CSSProperties}
                onClick={() => setSelectedSection(card.key)}
              >
                <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
                  {card.title}
                </h2>
                <p className="text-3xl font-bold mt-4 text-text-primary-light dark:text-text-primary-dark">
                  {card.value}
                </p>
                <span className="mt-6 px-3 py-1 rounded-full text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark">
                  Stats
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Aquí podrías agregar gráficos usando dashboardData.transactionsByType / transactionsByStatus */}
    </div>
  );
}

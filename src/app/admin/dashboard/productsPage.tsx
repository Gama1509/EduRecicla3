"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/utils/api";
import {
  DashboardProductsDto,
  ProductCategory,
  ProductCondition,
  ProductStatus,
  ProductType,
} from "@/types/dashboard-products.dto";

interface ProductsPageProps {
  onBack: () => void;
}

const COLORS = ["#FFBB28", "#00C49F", "#FF8042"];
const glowColors = ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.15)"];

export default function ProductsPage({ onBack }: ProductsPageProps) {
  const [products, setProducts] = useState<DashboardProductsDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filterCategory, setFilterCategory] = useState<"All" | ProductCategory>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | ProductStatus>("All");
  const [filterCondition, setFilterCondition] = useState<"All" | ProductCondition>("All");
  const [filterType, setFilterType] = useState<"All" | ProductType>("All");

  // Cargar productos
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.get<DashboardProductsDto[]>("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Productos filtrados (solo tabla y cantidad)
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (filterCategory === "All" || p.category === filterCategory) &&
          (filterStatus === "All" || p.status === filterStatus) &&
          (filterCondition === "All" || p.condition === filterCondition) &&
          (filterType === "All" || p.type === filterType)
      ),
    [products, filterCategory, filterStatus, filterCondition, filterType]
  );

  // Estadísticas generales (sin filtrar)
  const totalProducts = products.length;
  const totalInventory = products.reduce((acc, p) => acc + p.quantity, 0);
  const avgPriceByCategory = (category: ProductCategory) => {
    const filtered = products.filter((p) => p.category === category);
    if (!filtered.length) return 0;
    return filtered.reduce((acc, p) => acc + p.price, 0) / filtered.length;
  };

  // Datos para gráficos
  const categoryData = Object.values(ProductCategory).map((cat) => ({
    name: cat,
    count: products.filter((p) => p.category === cat).length,
  }));

  const statusData = Object.values(ProductStatus).map((st) => ({
    name: st,
    count: products.filter((p) => p.status === st).length,
  }));

  const conditionData = Object.values(ProductCondition).map((cond) => ({
    name: cond,
    count: products.filter((p) => p.condition === cond).length,
  }));

  const typeData = Object.values(ProductType).map((tp) => ({
    name: tp,
    count: products.filter((p) => p.type === tp).length,
  }));

  // Últimos productos agregados
  const latestProducts = [...products]
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, 3);

  if (loading)
    return <div className="col-span-full p-8 text-white text-center">Cargando productos...</div>;

  return (
    <div className="col-span-full p-8 space-y-8 rounded-lg transition-colors duration-300">
      <h2 className="text-3xl font-bold text-white text-center">Productos</h2>
      {/* Botón Volver al Dashboard */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded font-semibold text-white bg-black border border-white hover:shadow-[0_0_10px_yellow] transition-all"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total de productos", value: totalProducts },
          { title: "Inventario total", value: totalInventory },
          {
            title: "Precio promedio",
            value: `Laptop: $${avgPriceByCategory(ProductCategory.LAPTOP).toFixed(
              2
            )} | PC: $${avgPriceByCategory(ProductCategory.PC).toFixed(2)}`,
          },
          {
            title: "Total por tipo",
            value: `Venta: ${typeData.find((d) => d.name === ProductType.SALE)?.count || 0
              } | Donación: ${typeData.find((d) => d.name === ProductType.DONATION)?.count || 0}`,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-6 bg-black/80 rounded shadow text-center text-white border border-white hover:shadow-[0_0_15px_white] transition-all"
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Por Categoría", type: "bar", data: categoryData, fill: "#8884d8" },
          { title: "Por Estado", type: "pie", data: statusData },
          { title: "Por Condición", type: "bar", data: conditionData, fill: "#82ca9d" },
          { title: "Por Tipo", type: "bar", data: typeData, fill: "#FFBB28" },
        ].map((chart, idx) => (
          <div
            key={idx}
            className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all"
          >
            <p className="text-center font-medium mb-4">{chart.title}</p>
            <ResponsiveContainer width="100%" height={200}>
              {chart.type === "bar" ? (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" stroke="white" />
                  <YAxis allowDecimals={false} stroke="white" />
                  <Tooltip />
                  <Bar dataKey="count" fill={chart.fill} />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={chart.data}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {chart.data.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ color: "white" }}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Últimos productos */}
      <div className="p-6 bg-black/80 rounded shadow text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
        <p className="font-medium mb-2 text-center">Últimos productos agregados</p>
        <ul className="list-disc pl-6">
          {latestProducts.map((p, idx) => (
            <li key={idx}>
              {p.name} ({p.category}) - ${p.price}
            </li>
          ))}
        </ul>
      </div>

      {/* Filtros arriba de la tabla */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as any)}
          className="px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">Todas las categorías</option>
          {Object.values(ProductCategory).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">Todos los estados</option>
          {Object.values(ProductStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filterCondition}
          onChange={(e) => setFilterCondition(e.target.value as any)}
          className="px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">Todas las condiciones</option>
          {Object.values(ProductCondition).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">Todos los tipos</option>
          {Object.values(ProductType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Texto de cantidad filtrada */}
      <p className="text-white text-center mb-4">
        {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado
        {filteredProducts.length !== 1 ? "s" : ""}
      </p>

      {/* Tabla */}
      <div className="overflow-x-auto bg-black/80 rounded shadow p-6 border border-white hover:shadow-[0_0_15px_white] transition-all">
        <table className="min-w-full text-white">
          <thead>
            <tr>
              {[
                "Nombre",
                "Marca",
                "Categoría",
                "Condición",
                "Estado",
                "Tipo",
                "Precio",
                "Cantidad",
                "Propietario",
              ].map((th) => (
                <th key={th} className="py-2 px-4 text-left border-b border-white">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, idx) => (
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
                <td className="py-2 px-4 border-b border-white">{p.name}</td>
                <td className="py-2 px-4 border-b border-white">{p.brand}</td>
                <td className="py-2 px-4 border-b border-white">{p.category}</td>
                <td className="py-2 px-4 border-b border-white">{p.condition}</td>
                <td className="py-2 px-4 border-b border-white">{p.status}</td>
                <td className="py-2 px-4 border-b border-white">{p.type}</td>
                <td className="py-2 px-4 border-b border-white">${p.price}</td>
                <td className="py-2 px-4 border-b border-white">{p.quantity}</td>
                <td className="py-2 px-4 border-b border-white">{p.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
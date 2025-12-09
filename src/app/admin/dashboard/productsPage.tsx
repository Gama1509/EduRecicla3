'use client';

import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "@/utils/api";
import { DashboardProductsDto } from "@/types/dashboard-products.dto";
import { ProductCategory, ProductCondition, ProductStatus, ProductType } from "@/types/product-details.dto";
import { productTypeLabels, productConditionLabels, productStatusLabels } from "@/constants/productLabels";

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

  // Productos filtrados
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

  // Estadísticas generales
  const totalProducts = products.length;
  const totalInventory = products.reduce((acc, p) => acc + p.stock, 0);
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

      {/* Botón Volver */}
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
            value: `Laptop: $${avgPriceByCategory(ProductCategory.LAPTOP).toFixed(2)} | PC: $${avgPriceByCategory(ProductCategory.PC).toFixed(2)}`,
          },
          {
            title: "Total por tipo",
            value: `Venta: ${typeData.find((d) => d.name === ProductType.SALE)?.count || 0} | Donación: ${typeData.find((d) => d.name === ProductType.DONATION)?.count || 0}`,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[0, 1].map((idx) => {
          const chart = [
            { title: "Por Categoría", type: "bar", data: categoryData, fill: "#8884d8" },
            { title: "Por Estado", type: "pie", data: statusData },
            { title: "Por Condición", type: "bar", data: conditionData, fill: "#82ca9d" },
            { title: "Por Tipo", type: "bar", data: typeData, fill: "#FFBB28" },
          ][idx];

          return (
            <div
              key={idx}
              className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all"
            >
              <p className="text-center font-medium mb-4">{chart.title}</p>
              <ResponsiveContainer width="100%" height={200}>
                {chart.type === "bar" ? (
                  <BarChart data={chart.data}>
                    <XAxis
                      dataKey="name"
                      stroke="white"
                      tickFormatter={(val) => {
                        if (chart.title === "Por Estado") return productStatusLabels[val as ProductStatus];
                        if (chart.title === "Por Condición") return productConditionLabels[val as ProductCondition];
                        if (chart.title === "Por Tipo") return productTypeLabels[val as ProductType];
                        return val;
                      }}
                    />
                    <YAxis allowDecimals={false} stroke="white" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (chart.title === "Por Estado") return [value, productStatusLabels[name as ProductStatus]];
                        if (chart.title === "Por Condición") return [value, productConditionLabels[name as ProductCondition]];
                        if (chart.title === "Por Tipo") return [value, productTypeLabels[name as ProductType]];
                        return [value, name];
                      }}
                    />
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
                      label={(entry) => {
                        if (chart.title === "Por Estado") return productStatusLabels[entry.name as ProductStatus];
                        if (chart.title === "Por Condición") return productConditionLabels[entry.name as ProductCondition];
                        if (chart.title === "Por Tipo") return productTypeLabels[entry.name as ProductType];
                        return entry.name;
                      }}
                    >
                      {chart.data.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => {
                        if (chart.title === "Por Estado") return [value, productStatusLabels[name as ProductStatus]];
                        if (chart.title === "Por Condición") return [value, productConditionLabels[name as ProductCondition]];
                        if (chart.title === "Por Tipo") return [value, productTypeLabels[name as ProductType]];
                        return [value, name];
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ color: "white" }}
                      formatter={(value) => {
                        if (chart.title === "Por Estado") return productStatusLabels[value as ProductStatus];
                        if (chart.title === "Por Condición") return productConditionLabels[value as ProductCondition];
                        if (chart.title === "Por Tipo") return productTypeLabels[value as ProductType];
                        return value;
                      }}
                    />
                  </PieChart>

                )}
              </ResponsiveContainer>

            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[2, 3].map((idx) => {
          const chart = [
            { title: "Por Categoría", type: "bar", data: categoryData, fill: "#8884d8" },
            { title: "Por Estado", type: "pie", data: statusData },
            { title: "Por Condición", type: "bar", data: conditionData, fill: "#82ca9d" },
            { title: "Por Tipo", type: "bar", data: typeData, fill: "#FFBB28" },
          ][idx];

          return (
            <div
              key={idx}
              className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all"
            >
              <p className="text-center font-medium mb-4">{chart.title}</p>
              <ResponsiveContainer width="100%" height={200}>
                {chart.type === "bar" ? (
                  <BarChart data={chart.data}>
                    <XAxis
                      dataKey="name"
                      stroke="white"
                      tickFormatter={(val) => {
                        if (chart.title === "Por Estado") return productStatusLabels[val as ProductStatus];
                        if (chart.title === "Por Condición") return productConditionLabels[val as ProductCondition];
                        if (chart.title === "Por Tipo") return productTypeLabels[val as ProductType];
                        return val;
                      }}
                    />
                    <YAxis allowDecimals={false} stroke="white" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (chart.title === "Por Estado") return [value, productStatusLabels[name as ProductStatus]];
                        if (chart.title === "Por Condición") return [value, productConditionLabels[name as ProductCondition]];
                        if (chart.title === "Por Tipo") return [value, productTypeLabels[name as ProductType]];
                        return [value, name];
                      }}
                    />
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
                      label={(entry) => productStatusLabels[entry.name as ProductStatus] || entry.name}
                    >
                      {chart.data.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, productStatusLabels[name as ProductStatus]]} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "white" }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          );
        })}
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
        <SelectFilter value={filterCategory} onChange={setFilterCategory} options={ProductCategory} label="Todas las categorías" />
        <SelectFilter value={filterStatus} onChange={setFilterStatus} options={ProductStatus} label="Todos los estados" labelsMap={productStatusLabels} />
        <SelectFilter value={filterCondition} onChange={setFilterCondition} options={ProductCondition} label="Todas las condiciones" labelsMap={productConditionLabels} />
        <SelectFilter value={filterType} onChange={setFilterType} options={ProductType} label="Todos los tipos" labelsMap={productTypeLabels} />
      </div>
      {/* Filtros arriba de la tabla */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-2 items-center">
        <SelectFilter value={filterCategory} onChange={setFilterCategory} options={ProductCategory} label="Todas las categorías" />
        <SelectFilter value={filterStatus} onChange={setFilterStatus} options={ProductStatus} label="Todos los estados" labelsMap={productStatusLabels} />
        <SelectFilter value={filterCondition} onChange={setFilterCondition} options={ProductCondition} label="Todas las condiciones" labelsMap={productConditionLabels} />
        <SelectFilter value={filterType} onChange={setFilterType} options={ProductType} label="Todos los tipos" labelsMap={productTypeLabels} />

        {/* Botón Limpiar filtros */}
        <button
          onClick={() => {
            setFilterCategory("All");
            setFilterStatus("All");
            setFilterCondition("All");
            setFilterType("All");
          }}
          className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
        >
          Limpiar filtros
        </button>
      </div>


      {/* Texto de cantidad filtrada */}
      <p className="text-white text-center mb-4">
        {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
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
                "Tipo",
                "Condición",
                "Estado",
                "Precio",
                "Stock",
                "Cantidad Disponible",
                "Cantidad Reservada",
                "Propietario",
              ].map((th) => (
                <th
                  key={th}
                  className="py-2 px-4 text-center border-b border-white"
                >
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
                <td className="py-2 px-4 border-b border-white text-center">{p.name}</td>
                <td className="py-2 px-4 border-b border-white text-center">{p.brand}</td>
                <td className="py-2 px-4 border-b border-white text-center">{p.category}</td>
                <td className="py-2 px-4 border-b border-white text-center">{productTypeLabels[p.type]}</td>
                <td className="py-2 px-4 border-b border-white text-center">{productConditionLabels[p.condition]}</td>
                <td className="py-2 px-4 border-b border-white text-center">{productStatusLabels[p.status]}</td>
                <td className="py-2 px-4 border-b border-white text-center">${p.price}</td>
                <td className="py-2 px-4 border-b border-white text-center">{p.stock}</td>
                <td className="py-2 px-4 border-b border-white text-center">{p.availableQuantity}</td>
                <td className="py-2 px-4 border-b border-white text-center">{p.reservedQuantity}</td>
                <td className="py-2 px-4 border-b border-white text-center">{p.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

// Componente SelectFilter reutilizable
function SelectFilter<T extends string>({
  value,
  onChange,
  options,
  label,
  labelsMap,
}: {
  value: T | "All";
  onChange: (v: T | "All") => void;
  options: Record<string, T>;
  label: string;
  labelsMap?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | "All")}
      className="px-4 py-2 rounded bg-black/80 border border-white text-white"
    >
      <option value="All">{label}</option>
      {Object.values(options).map((opt) => (
        <option key={opt} value={opt}>
          {labelsMap ? labelsMap[opt] : opt}
        </option>
      ))}
    </select>
  );
}

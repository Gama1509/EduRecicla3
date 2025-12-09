"use client";
import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DashboardTransactionsDto, TransactionStatus, TransactionType } from "@/types/dashboard-transactions.dto";
import api from "@/utils/api";
import { notificationTypeLabels, statusLabels, typeLabels } from "@/constants/productLabels";

interface TransactionsPageProps {
    onBack: () => void;
}

const glowColors = ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)"];

const typeList: TransactionType[] = [TransactionType.SALE, TransactionType.DONATION];

export default function TransactionsPage({ onBack }: TransactionsPageProps) {
    const [transactions, setTransactions] = useState<DashboardTransactionsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string | "All">("All");
    const [filterType, setFilterType] = useState<string | "All">("All");
    const statusList = Object.values(TransactionStatus);
    const [searchSeller, setSearchSeller] = useState("");
    const [searchBuyer, setSearchBuyer] = useState("");
    const [searchProduct, setSearchProduct] = useState("");

    const getColor = (i: number, total: number) =>
        `hsl(${(i * 360) / total}, 70%, 50%)`;


    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get<DashboardTransactionsDto[]>("/transactions/dashboard");
                console.log(res.data);
                setTransactions(res.data);
            } catch (error) {
                console.error("Error cargando transacciones:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = useMemo(() =>
        transactions.filter(t =>
            (filterStatus === "All" || t.status === filterStatus) &&
            (filterType === "All" || t.type === filterType) &&
            t.seller.toLowerCase().includes(searchSeller.toLowerCase()) &&
            t.buyer.toLowerCase().includes(searchBuyer.toLowerCase()) &&
            t.product.toLowerCase().includes(searchProduct.toLowerCase())
        ), [transactions, filterStatus, filterType, searchSeller, searchBuyer, searchProduct]
    );
    const totalTransactions = transactions.length;
    const totalSold = transactions.reduce((acc, t) => acc + (t.status === TransactionStatus.COMPLETED ? t.totalPrice : 0), 0);
    const avgPrice = totalTransactions ? totalSold / totalTransactions : 0;

    const statusData = statusList.map(s => ({
        name: statusLabels[s],  // usa la traducción
        count: transactions.filter(t => t.status === s).length,
    }));


    const typeData = typeList.map(t => ({
        name: typeLabels[t],  // aquí usamos la traducción
        count: transactions.filter(tr => tr.type === t).length,
    }));

    if (loading) {
        return (
            <div className="col-span-full p-8 text-white text-center">
                <p className="text-xl mb-4">Cargando transacciones...</p>
                <div className="flex justify-center gap-2 animate-pulse">
                    <div className="w-20 h-4 bg-white/30 rounded"></div>
                    <div className="w-20 h-4 bg-white/30 rounded"></div>
                    <div className="w-20 h-4 bg-white/30 rounded"></div>
                </div>
            </div>
        );
    }

    const clearFilters = () => {
        setFilterStatus("All");
        setFilterType("All");
        setSearchSeller("");
        setSearchBuyer("");
        setSearchProduct("");
    };

    return (
        <div className="col-span-full p-8 rounded-lg space-y-8 transition-colors duration-300">
            <h2 className="text-3xl font-bold text-white text-center">Transacciones</h2>

            <div className="flex justify-center">
                <button
                    onClick={onBack}
                    className="px-6 py-2 rounded font-semibold text-white bg-black border border-white hover:shadow-[0_0_10px_yellow] transition-all"
                >
                    ← Volver al Dashboard
                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Total de transacciones", value: totalTransactions },
                    { title: "Total vendido", value: `$${totalSold}` },
                    { title: "Precio promedio", value: `$${avgPrice.toFixed(2)}` }
                ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-black/80 rounded shadow text-center text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-2xl font-bold mt-2">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-6"> {/* Solo una columna, cada div ocupa toda la fila */}
                <div className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
                    <p className="text-center font-medium mb-3">Por Estado</p>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart margin={{ top: 0, right: 0, bottom: 10, left: 0 }}>
                            <Pie
                                data={statusData}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="58%"   // ni tan arriba ni tan abajo
                                outerRadius={140}
                                label={{ fontSize: 25, fontWeight: 'bold' }}
                            >
                                {statusData.map((entry, i) => (
                                    <Cell key={i} fill={getColor(i, statusData.length)} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{ color: 'white' }}
                            />

                        </PieChart>
                    </ResponsiveContainer>
                </div>



                <div className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
                    <p className="text-center font-medium mb-3">Por Tipo</p>
                    <ResponsiveContainer width="100%" height={400}> {/* altura fija en px */}
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={typeData}>
                                <XAxis dataKey="name" stroke="white" />
                                <YAxis allowDecimals={false} stroke="white" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>

                    </ResponsiveContainer>
                </div>

            </div>

            {/* Filtros */}
            {/* Filtros y búsquedas */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded bg-black/80 border border-white text-white"
                >
                    <option value="All">Todos los estados</option>
                    {statusList.map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                </select>

                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="px-4 py-2 rounded bg-black/80 border border-white text-white"
                >
                    <option value="All">Todos los tipos</option>
                    {typeList.map(t => (
                        <option key={t} value={t}>{typeLabels[t]}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Buscar por vendedor"
                    value={searchSeller}
                    onChange={e => setSearchSeller(e.target.value)}
                    className="px-4 py-2 rounded bg-black/80 border border-white text-white"
                />
                <input
                    type="text"
                    placeholder="Buscar por comprador"
                    value={searchBuyer}
                    onChange={e => setSearchBuyer(e.target.value)}
                    className="px-4 py-2 rounded bg-black/80 border border-white text-white"
                />
                <input
                    type="text"
                    placeholder="Buscar por producto"
                    value={searchProduct}
                    onChange={e => setSearchProduct(e.target.value)}
                    className="px-4 py-2 rounded bg-black/80 border border-white text-white"
                />

                <button
                    onClick={clearFilters}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                    Limpiar filtros
                </button>
            </div>


            {/* Texto dinámico según filtros */}
            <p className="text-white text-center mb-4">
                {filteredTransactions.length} transacción{filteredTransactions.length !== 1 ? 'es' : ''} encontradas
            </p>

            {/* Tabla */}
            <div className="overflow-x-auto bg-black/80 rounded shadow p-4 border border-white hover:shadow-[0_0_15px_white] transition-all">
                <table className="min-w-full text-white border-collapse">
                    <thead>
                        <tr>
                            {[
                                "Producto",
                                "Vendedor",
                                "Comprador",
                                "Estado",
                                "Tipo de transacción",
                                "Total pagado",
                                "Cantidad solicitada",
                                "Razón de solicitud",
                                "Razón de cancelación",
                                "Razón de rechazo",
                                "Fecha de creación de la transacción",
                                "Última actualización",
                                "Fecha de entrega",
                                "Última notificación para el vendedor",
                                "Última notificación para el comprador",
                                "Última notificación de la transacción",
                            ].map(th => (
                                <th
                                    key={th}
                                    className="py-2 px-4 text-center border-b border-r border-white last:border-r-0"
                                >
                                    {th}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((t, idx) => (
                            <tr
                                key={t.id}
                                className="border-b border-border-light dark:border-border-dark transition-all duration-300 transform cursor-pointer"
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
                                {[
                                    t.product,
                                    t.seller,
                                    t.buyer,
                                    statusLabels[t.status],
                                    typeLabels[t.type],
                                    `$${t.totalPrice}`,
                                    t.quantityRequested,
                                    t.requestReason ?? "El comprador no incluyó razón de solicitud",
                                    t.cancelReason ?? "Esta transacción no ha sido cancelada hasta el momento",
                                    t.rejectedReason ?? "Esta transacción no ha sido rechazada hasta el momento",
                                    t.createdAt,
                                    t.updatedAt,
                                    t.deliveredAt ?? "El producto todavía no ha sido entregado",
                                    t.last_notification_type_for_seller
                                        ? notificationTypeLabels[t.last_notification_type_for_seller]
                                        : "No hay ninguna notificación para usted hasta el momento",
                                    t.last_notification_type_for_buyer
                                        ? notificationTypeLabels[t.last_notification_type_for_buyer]
                                        : "No hay ninguna notificación para el comprador hasta el momento",
                                    t.last_notification_type_for_transaction
                                        ? notificationTypeLabels[t.last_notification_type_for_transaction]
                                        : "No se muestra ninguna notificación hasta el momento"
                                ].map((cell, i) => (
                                    <td
                                        key={i}
                                        className="py-2 px-4 border-b border-r border-white last:border-r-0 text-center"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </div>
    );
}

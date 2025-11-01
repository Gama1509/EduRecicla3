"use client";
import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DashboardTransactionsDto, TransactionStatus, TransactionType } from "@/types/dashboard-transactions.dto";
import api from "@/utils/api";

interface TransactionsPageProps {
    onBack: () => void;
}

const COLORS = ["#FFBB28", "#00C49F", "#FF8042", "#8884d8"];
const glowColors = ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)"];
const statusList: TransactionStatus[] = [TransactionStatus.PENDING, TransactionStatus.IN_PROGRESS, TransactionStatus.COMPLETED, TransactionStatus.CANCELLED];
const typeList: TransactionType[] = [TransactionType.SALE, TransactionType.DONATION];

export default function TransactionsPage({ onBack }: TransactionsPageProps) {
    const [transactions, setTransactions] = useState<DashboardTransactionsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string | "All">("All");
    const [filterType, setFilterType] = useState<string | "All">("All");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get<DashboardTransactionsDto[]>("/transactions/dashboard");
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
            (filterType === "All" || t.type === filterType)
        ), [transactions, filterStatus, filterType]
    );

    const totalTransactions = transactions.length;
    const totalSold = transactions.reduce((acc, t) => acc + (t.status === TransactionStatus.COMPLETED ? t.totalPrice : 0), 0);
    const avgPrice = totalTransactions ? totalSold / totalTransactions : 0;

    const statusData = statusList.map(s => ({
        name: s,
        count: transactions.filter(t => t.status === s).length,
    }));

    const typeData = typeList.map(t => ({
        name: t,
        count: transactions.filter(tr => tr.type === t).length,
    }));

    const latestTransactions = [...transactions]
        .sort((a, b) => (b.date > a.date ? 1 : -1))
        .slice(0, 3);

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
                    { title: "Total transacciones", value: totalTransactions },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
                    <p className="text-center font-medium mb-3">Por Estado</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {statusData.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'white' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-black/80 rounded shadow p-4 text-white border border-white hover:shadow-[0_0_15px_white] transition-all">
                    <p className="text-center font-medium mb-3">Por Tipo</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={typeData}>
                            <XAxis dataKey="name" stroke="white" />
                            <YAxis allowDecimals={false} stroke="white" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-6 mb-2">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded bg-black/80 border border-white text-white">
                    <option value="All">Todos los estados</option>
                    {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-4 py-2 rounded bg-black/80 border border-white text-white">
                    <option value="All">Todos los tipos</option>
                    {typeList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Texto dinámico según filtros */}
            <p className="text-white text-center mb-4">
                {filteredTransactions.length} transacción{filteredTransactions.length !== 1 ? 'es' : ''} encontradas
            </p>

            {/* Tabla */}
            <div className="overflow-x-auto bg-black/80 rounded shadow p-4 border border-white hover:shadow-[0_0_15px_white] transition-all">
                <table className="min-w-full text-white">
                    <thead>
                        <tr>
                            {["Producto", "Vendedor", "Comprador", "Estado", "Tipo", "Total", "Solicitado", "Entregado", "Fecha"].map(th => (
                                <th key={th} className="py-2 px-4 text-left border-b border-white">{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((t, idx) => (
                            <tr
                                key={t.id}
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
                                <td className="py-2 px-4 border-b border-white">{t.product}</td>
                                <td className="py-2 px-4 border-b border-white">{t.seller}</td>
                                <td className="py-2 px-4 border-b border-white">{t.buyer}</td>
                                <td className="py-2 px-4 border-b border-white">{t.status}</td>
                                <td className="py-2 px-4 border-b border-white">{t.type}</td>
                                <td className="py-2 px-4 border-b border-white">${t.totalPrice}</td>
                                <td className="py-2 px-4 border-b border-white">{t.quantityRequested}</td>
                                <td className="py-2 px-4 border-b border-white">{t.quantityDelivered}</td>
                                <td className="py-2 px-4 border-b border-white">{t.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

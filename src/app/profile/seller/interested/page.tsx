'use client';
import { SelectFilter } from "@/app/profile/my-products/page";
import { handleAcceptInterest, handleRejectInterest } from "@/app/notifications/views/NotificationViews";
import { notificationTypeLabels, productTypeLabels, statusLabels } from "@/constants/productLabels";
import { TransactionStatus, TransactionType } from "@/types/dashboard-transactions.dto";
import { TransactionsProfileDto } from "@/types/transactions/transactions-profile.dto";
import api from "@/utils/api";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handleApiError } from "@/utils/handleApiError";
import withAuth from "@/components/auth/withAuth";

function ProductViewPage() {
    const [transactions, setTransactions] = useState<TransactionsProfileDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');

    const router = useRouter();

    const allowedStatusOptions = [
        TransactionStatus.INTERESTED,
        TransactionStatus.SOLD_OUT_PARTIAL,
        TransactionStatus.SOLD_OUT_TOTAL,
        TransactionStatus.NOTIFY_AVAILABLE_ANY,
        TransactionStatus.NOTIFY_AVAILABLE_FULL,
    ];

    const getStatusGlow = (status: TransactionStatus) => {
        switch (status) {
            case TransactionStatus.INTERESTED:
                return 'green';
            case TransactionStatus.SOLD_OUT_PARTIAL:
            case TransactionStatus.SOLD_OUT_TOTAL:
                return 'red';
            case TransactionStatus.NOTIFY_AVAILABLE_ANY:
            case TransactionStatus.NOTIFY_AVAILABLE_FULL:
                return 'yellow';
            default:
                return 'gray'; // color por defecto si hay un status inesperado
        }
    };





    const handleViewProduct = (id: string) => {
        router.push(`/buy/${id}`);
    };

    const clearFilters = () => {
        setSearchName('');
        setFilterStatus('');
        setFilterType('');
    };

    const filteredTransactions = transactions.filter(p => {
        const matchesType = !filterType || String(p.type) === filterType;
        const matchesStatus = !filterStatus || String(p.transaction_status) === filterStatus;
        const matchesSearch =
            !searchName ||
            p.product.toLowerCase().includes(searchName.toLowerCase()) ||
            p.buyer.toLowerCase().includes(searchName.toLowerCase());

        return matchesType && matchesStatus && matchesSearch;
    });



    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get<TransactionsProfileDto[]>(`/transactions/getInterestedInMyProductsTransactions`);
                setTransactions(res.data);
            } catch (error) {
                handleApiError(error, "Error al obtener las transacciones.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);


    return (
        <div className="p-6 w-full overflow-x-auto">
            <div className="flex flex-col items-center mb-8 gap-6">
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">
                    Transaccciones con gente interesada en mis productos
                </h1>
                {loading && (
                    <p className="text-center text-text-primary-light dark:text-text-primary-dark">
                        Cargando...
                    </p>
                )}
                {!loading && transactions.length === 0 ? (
                    <p className="text-red-400 text-lg font-semibold text-center">
                        No hay transacciones para mostrar.
                    </p>
                ) : (
                    /* Caso 2 y 3: sí hay transacciones (o filtradas) */
                    <>
                        {/* Barra de búsqueda */}
                        <div className="w-full max-w-md">
                            <div className="relative w-full">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar transacción por nombre del comprador o producto..."
                                    value={searchName}
                                    onChange={e => setSearchName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-full bg-black/70 border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white focus:border-white focus:shadow-lg transition-all"
                                />
                            </div>
                        </div>
                        {/* Filtros */}
                        <div className="flex flex-wrap justify-center gap-2 w-full max-w-5xl">
                            <SelectFilter value={filterType} onChange={setFilterType} options={TransactionType} label="Todos los tipos" labelsMap={productTypeLabels} />
                            <SelectFilter value={filterStatus} onChange={setFilterStatus} options={allowedStatusOptions} label="Todos los estados" labelsMap={statusLabels} />

                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 rounded border border-gray-700 text-white font-semibold bg-gray-800 transition-all duration-300 hover:bg-gray-600 hover:text-white hover:text-lg"
                            >
                                Limpiar filtros
                            </button>

                        </div>

                        {/* Conteo */}
                        <p className="mb-4 text-text-primary-light dark:text-text-primary-dark text-center">
                            Transacciones que coinciden: {filteredTransactions.length}
                        </p>
                        <div className="w-full overflow-x-auto bg-black/80 rounded shadow p-4 border border-white hover:shadow-[0_0_15px_white] transition-all">
                            <table className="table-auto w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border-light dark:border-border-dark">
                                        {[
                                            "Foto del producto",
                                            "Tipo de transacción",
                                            "Comprador",
                                            "Producto",
                                            "Cantidad solicitada",
                                            "Razón de la solicitud",
                                            "Estado de la transacción",
                                            "Solicitada el:",
                                            "Última actualización:",
                                            "Tipo de la última notificación para usted",
                                            "Tipo de la última notificación para el comprador",
                                            "Tipo de la última notificación de la transacción en general",
                                            "Acciones",
                                        ].map((header, i, arr) => (
                                            <th
                                                key={header}
                                                className={`py-3 px-4 whitespace-nowrap text-center align-middle text-text-primary-light dark:text-text-primary-dark 
                            ${i !== arr.length - 1 ? "border-r border-border-light dark:border-border-dark" : ""}
                        `}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTransactions.map((transaction) => {
                                        const statusGlow = getStatusGlow(transaction.transaction_status);

                                        return (
                                            <tr
                                                key={transaction.id}
                                                className="border-b border-border-light dark:border-border-dark transition-all duration-300 transform cursor-pointer"
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = `0 0 15px ${statusGlow}`;
                                                    e.currentTarget.style.transform = "scale(1.02)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = "";
                                                    e.currentTarget.style.transform = "";
                                                }}
                                            >
                                                {/* Foto del producto */}
                                                <td className="py-2 px-4 border-r text-center min-w-[150px]">
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={transaction.product_image}
                                                            alt="icono"
                                                            className="w-16 h-16 object-contain"
                                                        />
                                                    </div>
                                                </td>

                                                {/* Tipo */}
                                                <td className="py-2 px-4 border-r text-center min-w-[150px]">
                                                    {productTypeLabels[transaction.type]}
                                                </td>

                                                {/* Comprador */}
                                                <td className="py-3 px-8 border-r text-center min-w-[280px]">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <img
                                                            src={transaction.buyer_image}
                                                            alt="avatar"
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        <span className="whitespace-nowrap">{transaction.buyer}</span>
                                                    </div>
                                                </td>

                                                {/* Producto */}
                                                <td className="py-2 px-4 border-r text-center min-w-[170px]">
                                                    {transaction.product}
                                                </td>

                                                {/* Cantidad */}
                                                <td className="py-2 px-4 border-r text-center min-w-[140px]">
                                                    {transaction.quantityRequested}
                                                </td>

                                                {/* Razón */}
                                                <td className="py-2 px-4 border-r text-center min-w-[220px]">
                                                    {transaction.requestReason ?? "No incluyó razón"}
                                                </td>

                                                {/* Estado */}
                                                <td className="py-2 px-4 border-r text-center min-w-[170px]">
                                                    {statusLabels[transaction.transaction_status]}
                                                </td>

                                                {/* Fechas */}
                                                <td className="py-2 px-4 border-r text-center min-w-[180px]">
                                                    {transaction.createdAt}
                                                </td>

                                                <td className="py-2 px-4 border-r text-center min-w-[180px]">
                                                    {transaction.updatedAt}
                                                </td>

                                                {/* Notificaciones */}
                                                <td className="py-2 px-4 border-r text-center min-w-[240px]">
                                                    {notificationTypeLabels[transaction.last_notification_type_for_seller] ??
                                                        "No hay ninguna notificación para usted hasta el momento"}
                                                </td>

                                                <td className="py-2 px-4 border-r text-center min-w-[240px]">
                                                    {notificationTypeLabels[transaction.last_notification_type_for_buyer] ??
                                                        "No hay ninguna notificación para el comprador hasta el momento"}
                                                </td>

                                                <td className="py-2 px-4 border-r text-center min-w-[240px]">
                                                    {notificationTypeLabels[transaction.last_notification_type_for_transaction] ??
                                                        "No se muestra ninguna notificación hasta el momento"}
                                                </td>

                                                {/* Acciones */}
                                                <td className="py-2 px-4 text-center min-w-[180px]">
                                                    <div className="flex justify-center gap-4">
                                                        {transaction.transaction_status === TransactionStatus.INTERESTED ? (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleAcceptInterest(
                                                                            transaction.buyer_id,
                                                                            transaction.id,
                                                                            setLoading,
                                                                        )
                                                                    }
                                                                    className="text-green-500 font-semibold hover:underline transition-colors"
                                                                    disabled={loading}
                                                                >
                                                                    Aceptar
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleRejectInterest(
                                                                            transaction.buyer_id,
                                                                            transaction.id,
                                                                            setLoading,
                                                                        )
                                                                    }
                                                                    className="text-red-500 font-semibold hover:underline transition-colors"
                                                                    disabled={loading}
                                                                >
                                                                    Rechazar
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleViewProduct(transaction.product_id)
                                                                    }
                                                                    className="text-blue-500 font-semibold hover:underline transition-colors"
                                                                    disabled={loading}

                                                                >
                                                                    Ver producto
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleViewProduct(transaction.product_id)
                                                                }
                                                                className="text-blue-500 font-semibold hover:underline transition-colors"
                                                                disabled={loading}
                                                            >
                                                                Ver producto
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>


                    </>
                )}

            </div>

        </div >
    );
}
export default withAuth(ProductViewPage, true, false);
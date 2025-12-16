'use client';
import { SelectFilter } from "@/app/profile/my-products/page";
import { handleAcceptInterest, handleRejectInterest } from "@/app/notifications/views/NotificationViews";
import { notificationTypeLabels, productTypeLabels, statusLabels } from "@/constants/productLabels";
import { TransactionStatus, TransactionType } from "@/types/dashboard-transactions.dto";
import { TransactionsProfileInProgressDto } from "@/types/transactions/transactions-profile-in-progress.dto";
import { TransactionsProfileDto } from "@/types/transactions/transactions-profile.dto";
import api from "@/utils/api";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { handleApiError } from "@/utils/handleApiError";
import withAuth from "@/components/auth/withAuth";

function ProductViewPage() {
    const [transactions, setTransactions] = useState<TransactionsProfileInProgressDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [filterType, setFilterType] = useState('');


    const router = useRouter();

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

    const handleGoChat = (chatId: string) => {
        router.push(`/chats/${chatId}`);
    };

    const clearFilters = () => {
        setSearchName('');
        setFilterType('');
    };

    const filteredTransactions = transactions.filter(p => {
        const matchesType = !filterType || String(p.type) === filterType;
        const matchesSearch =
            !searchName ||
            p.product.toLowerCase().includes(searchName.toLowerCase()) ||
            p.buyer.toLowerCase().includes(searchName.toLowerCase());

        return matchesType && matchesSearch;
    });



    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get<TransactionsProfileInProgressDto[]>(`/transactions/getTransactionsInProgressByBuyer`);
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
                    Transaccciones en progreso
                </h1>
                {/* LOADING AQUÍ — MISMA ALTURA QUE filteredTransactions.length > 0 */}
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
                                    className="w-full pl-10 pr-4 py-3 rounded-full bg-black/70 border border-white text-white placeholder-gray-400 
              focus:outline-none focus:ring-4 focus:ring-white focus:border-white focus:shadow-lg transition-all"
                                />
                            </div>
                        </div>
                        {/* Filtros */}
                        <div className="flex flex-wrap justify-center gap-2 w-full max-w-5xl">
                            <SelectFilter value={filterType} onChange={setFilterType} options={TransactionType} label="Todos los tipos" labelsMap={productTypeLabels} />

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
                                            "Vendedor",
                                            "Producto",
                                            "Cantidad solicitada",
                                            "Razón de la solicitud",
                                            "Estado de la transacción",
                                            "Solicitada el:",
                                            "Última actualización:",
                                            "Tipo de la última notificación para usted",
                                            "Tipo de la última notificación para el vendedor",
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
                                                className="border-b border-border-light dark:border-border-dark transition-all duration-300 cursor-pointer"
                                                onMouseEnter={(e) => {
                                                    const el = e.currentTarget as HTMLElement;
                                                    el.style.boxShadow = `0 0 15px ${statusGlow}`;
                                                    el.style.transform = "scale(1.02)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    const el = e.currentTarget as HTMLElement;
                                                    el.style.boxShadow = "";
                                                    el.style.transform = "";
                                                }}
                                            >
                                                {/* Imagen del producto */}
                                                <td className="py-2 px-4 border-r text-center align-middle">
                                                    <div className="flex justify-center items-center">
                                                        <img
                                                            src={transaction.product_image}
                                                            alt="icono"
                                                            className="w-16 h-16 object-contain"
                                                        />
                                                    </div>
                                                </td>

                                                {/* Tipo */}
                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[150px]">
                                                    {productTypeLabels[transaction.type]}
                                                </td>

                                                {/* Comprador */}
                                                <td className="py-3 px-4 border-r text-center align-middle min-w-[220px]">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <img
                                                            src={transaction.seller_image}
                                                            alt="avatar"
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        <span className="whitespace-nowrap">{transaction.seller}</span>
                                                    </div>
                                                </td>

                                                {/* Producto */}
                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[150px]">
                                                    {transaction.product}
                                                </td>

                                                {/* Cantidad */}
                                                <td className="py-2 px-4 border-r text-center align-middle min-w-[130px]">
                                                    {transaction.quantityRequested}
                                                </td>

                                                {/* Razón */}
                                                <td className="py-2 px-4 border-r text-center align-middle min-w-[220px]">
                                                    {transaction.requestReason ?? "No incluyó razón"}
                                                </td>

                                                {/* Estado */}
                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[170px]">
                                                    {statusLabels[transaction.transaction_status]}
                                                </td>

                                                {/* Fechas */}
                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[180px]">
                                                    {transaction.createdAt}
                                                </td>
                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[180px]">
                                                    {transaction.updatedAt}
                                                </td>

                                                {/* Notificaciones */}
                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[240px]">
                                                    {notificationTypeLabels[transaction.last_notification_type_for_buyer] ??
                                                        "No hay ninguna notificación para el comprador hasta el momento"}
                                                </td>

                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[240px]">
                                                    {notificationTypeLabels[transaction.last_notification_type_for_seller] ??
                                                        "No hay ninguna notificación para usted hasta el momento"}
                                                </td>

                                                <td className="py-2 px-4 border-r text-center align-middle whitespace-nowrap min-w-[240px]">
                                                    {notificationTypeLabels[transaction.last_notification_type_for_transaction] ??
                                                        "No se muestra ninguna notificación hasta el momento"}
                                                </td>

                                                <td className="py-2 px-4 text-center min-w-[180px]">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => handleViewProduct(transaction.product_id)}
                                                            className="text-blue-500 font-semibold hover:underline transition-colors"
                                                            disabled={loading}
                                                        >
                                                            Ver producto
                                                        </button>
                                                        <button
                                                            onClick={() => handleGoChat(transaction.chatId)}
                                                            className="text-green-500 font-semibold hover:underline transition-colors"
                                                            disabled={loading}
                                                        >
                                                            Ir al chat
                                                        </button>
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
        </div>
    );

}

export default withAuth(ProductViewPage, true, false);
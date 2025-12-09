"use client";
import { AvailableAnyNotification, AvailableFullNotification, BuyerCancelledTransactionNotification, BuyerWaitAnyNotification, BuyerWaitFullNotification, CompletionConfirmedBuyerNotification, CompletionConfirmedSellerNotification, DeliveryMarkedNotification, InterestAcceptedNotification, InterestCancelledNotification, InterestMarkedNotification, InterestRejectedNotification, ProductAcceptedNotification, ProductRejectedNotification, SellerCancelledTransactionNotification, SoldOutPartialNotification, SoldOutTotalNotification } from "@/types/notifications/notification.dto";
import { ProductSummaryForNotification } from "@/types/products/product-summary-notification.dto";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationType } from "@/types/notifications/notification-type.enum";
import Swal from 'sweetalert2';
import api from "@/utils/api";
import { RejectInterestDto } from "@/types/notifications/reject-interest.dto";
import { AcceptInterestDto } from "@/types/notifications/accept-interest.dto";
import { useState } from "react";
import { cancelInterestAction } from "@/app/buy/[productId]/page";

type UserInfoCardProps = {
    user_name: string;
    avatarUrl?: string | null;
    role: "buyer" | "seller";
};

export const confirmDeliveryAction = async ({
    transactionId,
    setLoadingAction,
}: {
    transactionId: string;
    setLoadingAction: (loading: boolean) => void;
}) => {

    // Confirmación inicial
    const confirm = await Swal.fire({
        title: "Confirmar entrega",
        text: "¿Confirmas que recibiste el producto correctamente?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
        setLoadingAction(true);

        // Llamada a API
        await api.patch(`/transactions/${transactionId}/confirm-delivery`);

        await Swal.fire(
            "Entrega confirmada",
            "Has confirmado la entrega correctamente.",
            "success"
        );

        window.location.reload();

    } catch (error) {
        Swal.fire("Error", "No se pudo confirmar la entrega.", "error");
    } finally {
        setLoadingAction(false);
    }
};


export const confirmAndContinueAction = async ({
    transactionId,
    setLoadingAction,
}: {
    transactionId: string;
    setLoadingAction: (loading: boolean) => void;
}) => {

    // Confirmación inicial
    const confirm = await Swal.fire({
        title: "Confirmar y continuar",
        text: "¿Deseas confirmar y continuar con el proceso?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
        setLoadingAction(true);

        // Llamada al backend
        await api.post(`/transactions/confirm-and-continue`, {
            transactionId: transactionId
        });

        Swal.fire(
            "Confirmado",
            "La acción se completó correctamente.",
            "success"
        ).then(() => window.location.reload());

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo completar la acción.", "error");
    } finally {
        setLoadingAction(false);
    }
};


export const adjustQuantityRequestedAction = async ({
    transactionId,
    available,
    setLoadingAction,
}: {
    transactionId: string;
    available: number;
    setLoadingAction: (loading: boolean) => void;
}) => {

    // Paso 1 — pedir nueva cantidad
    const newQty = await Swal.fire({
        title: "Cantidad insuficiente",
        text: `La cantidad disponible cambió y ahora es menor a la solicitada. Actualmente hay ${available} unidades disponibles. Ingresa cuántas deseas solicitar ahora.`,
        input: "number",
        inputAttributes: {
            min: "1",
            max: String(available),
        },
        showCancelButton: true,
        confirmButtonText: "Aceptar",
    });

    if (!newQty.isConfirmed || !newQty.value) return;

    // Paso 2 — Confirmación final
    const secondConfirm = await Swal.fire({
        title: "Confirmar cantidad",
        text: `¿Deseas solicitar ${newQty.value} unidades?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
    });

    if (!secondConfirm.isConfirmed) return;

    try {
        setLoadingAction(true);

        const res = await api.post(
            `/transactions/${transactionId}/adjust-quantity`,
            { quantity: Number(newQty.value) }
        );

        if (!res || (res.status !== 200 && res.status !== 201)) {
            return Swal.fire("Error", "No se pudo ajustar la cantidad.", "error");
        }

        Swal.fire(
            "Cantidad actualizada",
            "La cantidad solicitada fue ajustada.",
            "success"
        ).then(() => window.location.reload());

    } catch (e) {
        Swal.fire("Error", "No se pudo ajustar la cantidad.", "error");
    } finally {
        setLoadingAction(false);
    }
};

export const notifyAnyIncreaseAction = async ({
    transactionId,
    setLoadingAction,
}: {
    transactionId: string;
    setLoadingAction: (loading: boolean) => void;
}) => {

    const confirm = await Swal.fire({
        title: "¿Recibir aviso?",
        text: "Te notificaremos cuando la cantidad disponible aumente, aunque sea en una sola unidad.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
    });

    if (!confirm.isConfirmed) return;

    try {
        setLoadingAction(true);

        await api.post(`transactions/notify/available-any/${transactionId}`);

        Swal.fire(
            "Proceso exitoso",
            "Se le notificará cuando la cantidad disponible aumente.",
            "success"
        ).then(() => window.location.reload());

    } catch (error) {
        Swal.fire("Error", "No se pudo registrar la notificación.", "error");
    } finally {
        setLoadingAction(false);
    }
};

export const notifyUntilFullAction = async ({
    transactionId,
    setLoadingAction,
}: {
    transactionId: string;
    setLoadingAction: (loading: boolean) => void;
}) => {

    const confirm = await Swal.fire({
        title: "¿Recibir aviso?",
        text: "Te notificaremos cuando la cantidad disponible alcance la cantidad que solicitaste originalmente.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
    });

    if (!confirm.isConfirmed) return;

    try {
        setLoadingAction(true);

        await api.post(`transactions/notify/available-full/${transactionId}`);

        Swal.fire(
            "Proceso exitoso",
            "Se le notificará cuando la cantidad disponible alcance la cantidad completa que solicitaste.",
            "success"
        ).then(() => window.location.reload());

    } catch (error) {
        Swal.fire("Error", "No se pudo registrar la notificación.", "error");
    } finally {
        setLoadingAction(false);
    }
};

export const handleCancelInterestSoldOut = async (
    transactionId: string,
    setLoadingAction: (value: boolean) => void
) => {
    const confirm = await Swal.fire({
        title: "¿Cancelar tu interés?",
        text: "No recibirás la sanción habitual de 15 días por esta cancelación.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
        setLoadingAction(true);

        await api.post(`/transactions/interest/${transactionId}/cancel-sold-out`);

        Swal.fire("Interés cancelado", "Tu interés fue cancelado correctamente.", "success")
            .then(() => window.location.reload());
    } catch (error) {
        Swal.fire("Error", "No se pudo cancelar el interés.", "error");
    } finally {
        setLoadingAction(false);
    }
};

export const handleRejectInterest = async (
    buyerId: string,
    transactionId: string,
    setLoadingAction: (loading: boolean) => void
) => {

    // 1️⃣ Confirmación inicial
    const { isConfirmed } = await Swal.fire({
        title: 'Rechazar interés',
        text: '¿Estás seguro de que quieres rechazar este interés?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar',
    });

    if (!isConfirmed) return;

    // 2️⃣ Pedir razón del rechazo
    const { value: reason } = await Swal.fire({
        title: 'Motivo del rechazo',
        input: 'text',
        inputLabel: 'Escribe la razón por la que rechazas este interés',
        inputPlaceholder: 'Motivo...',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'Debes escribir una razón';
            return null;
        },
    });

    if (!reason) return;

    try {
        setLoadingAction(true); // ⏳ Activar loading

        // 3️⃣ Construir DTO
        const dto: RejectInterestDto = {
            buyerId,
            transactionId,
            rejectedReason: reason,
        };

        const response = await api.post('/products/interest/reject', dto);

        if (response?.data?.success) {
            await Swal.fire(
                'Rechazado',
                'El interés ha sido rechazado correctamente',
                'success'
            );
            window.location.reload();
        } else {
            Swal.fire('Error', 'No se pudo rechazar el interés', 'error');
        }

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo rechazar el interés', 'error');
    } finally {
        setLoadingAction(false); // ⏳ Desactivar loading
    }
};

export const handleAcceptInterest = async (
    buyerId: string,
    transactionId: string,
    setLoadingAction: (loading: boolean) => void
) => {

    const result = await Swal.fire({
        title: "Aceptar interés",
        text: "¿Seguro que quieres aceptar este interés?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, aceptar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
        setLoadingAction(true); // 🔵 Bloquea los botones

        const dto: AcceptInterestDto = {
            transactionId,
            buyerId,
        };

        await api.post("/products/interest/accept", dto);

        await Swal.fire({
            icon: "success",
            title: "Interés aceptado",
            html: `
                Se ha notificado al comprador correctamente.<br>
                Ahora puedes comunicarte con él/ella en los chats.
            `,
            confirmButtonText: "Entendido",
        });

        window.location.reload();

    } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo aceptar el interés.", "error");
    } finally {
        setLoadingAction(false); // 🔵 Siempre desbloquea
    }
};





export function UserInfoCard({ user_name, avatarUrl, role }: UserInfoCardProps) {
    return (
        <div className="flex flex-col items-center mb-4">
            {avatarUrl && (
                <img
                    src={avatarUrl}
                    alt={user_name}
                    className="w-12 h-12 rounded-full mb-2"
                />
            )}

            {role === "buyer" ? (
                <p className="font-medium text-center">
                    Comprador interesado: {user_name}
                </p>
            ) : (
                <p className="font-medium text-center">
                    Vendedor: {user_name}
                </p>
            )}
        </div>
    );
}

export function ViewProductButton({
    canViewProduct,
    productId,
}: {
    canViewProduct: boolean;
    productId: string;
}) {
    if (!canViewProduct) return null;

    return (
        <Link
            href={`/buy/${productId}`}
            className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 
                       transition duration-300 inline-block text-center"
        >
            Ver producto
        </Link>
    );
}
export function getNotificationTitle(type: NotificationType): string {
    switch (type) {
        // Revisiones de producto
        case NotificationType.PRODUCT_ACCEPTED:
            return "Producto aceptado";
        case NotificationType.PRODUCT_REJECTED:
            return "Producto rechazado";

        // Flujo de interés
        case NotificationType.INTEREST_MARKED:
            return "Nuevo interés en tu producto";
        case NotificationType.INTEREST_ACCEPTED:
            return "Tu interés fue aceptado";
        case NotificationType.INTEREST_REJECTED:
            return "Tu interés fue rechazado";
        case NotificationType.INTEREST_CANCELLED:
            return "Interés cancelado por el comprador";

        // Transacciones en curso
        case NotificationType.SELLER_CANCELLED_TRANSACTION:
            return "El vendedor canceló la transacción";
        case NotificationType.BUYER_CANCELLED_TRANSACTION:
            return "El comprador canceló la transacción";
        case NotificationType.DELIVERY_MARKED:
            return "Entrega marcada por el vendedor";
        case NotificationType.COMPLETION_CONFIRMED_SELLER:
            return "El comprador ha confirmado la entrega del producto.";

        case NotificationType.COMPLETION_CONFIRMED_BUYER:
            return "Has confirmado la entrega del producto.";



        // Stock agotado
        case NotificationType.SOLD_OUT_TOTAL:
            return "Producto agotado";
        case NotificationType.SOLD_OUT_PARTIAL:
            return "Stock parcial disponible";

        // Stock disponible
        case NotificationType.NOTIFY_AVAILABLE_ANY:
            return "Stock disponible (cualquier cantidad)";
        case NotificationType.NOTIFY_AVAILABLE_FULL:
            return "Stock disponible (cantidad completa)";

        // Decisiones de espera del comprador
        case NotificationType.BUYER_WAIT_ANY:
            return "El comprador decidió esperar (cualquier cantidad)";
        case NotificationType.BUYER_WAIT_FULL:
            return "El comprador decidió esperar (cantidad completa)";

        default:
            return "Notificación";
    }
}



function ProductTable({ product }: { product: ProductSummaryForNotification }) {
    return (
        <div className="mt-4 p-4 bg-white dark:bg-white/10 rounded-lg shadow-md transition-all duration-300">
            <div className="grid grid-cols-2 gap-4 mb-4">
                {product.imageUrls.map((url, i) => (
                    <img
                        key={i}
                        src={url}
                        alt={`Producto ${product.name}`}
                        className="w-full h-40 object-cover rounded-lg border border-gray-300 dark:border-white/30"
                    />
                ))}
            </div>

            <table className="w-full table-auto text-left border-collapse border border-gray-300 dark:border-white/30">
                <tbody>
                    {[
                        ["Nombre", product.name],
                        ["Marca", product.brand],
                        ["Categoría", product.category],
                        ["Condición", product.condition],
                        ["Estado", product.status],
                        ["Tipo", product.type],
                        ["Precio", product.price],
                        ["Cantidad disponible", product.availableQuantity],
                        ["Dueño", product.ownerName],
                    ].map(([label, value], i) => (
                        <tr
                            key={i}
                            className="hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            <td className="py-2 px-4 font-medium border-b border-gray-300 dark:border-white/30">
                                {label}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-white/30">
                                {value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function NotificationWrapper({
    title,
    message,
    children,
    //interactionMessage,
}: {
    title: string;
    message: string;
    //interactionMessage: string;
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-white/10 rounded-lg shadow-md transition-all duration-300">
            <h2 className="text-3xl font-bold text-center mb-4 text-secondary dark:text-secondary-dark">
                {title}
            </h2>
            {/*<p className="text-center mb-4 text-sm text-blue-600 dark:text-blue-400">
                {interactionMessage}
            </p>*/}
            <p className="text-center mb-6 text-text-secondary-light dark:text-text-secondary-dark">
                {message}
            </p>
            {children}
        </div>
    );
}

// ---------- VIEWS ----------

// PRODUCT_ACCEPTED
export function ProductAcceptedView({
    notification,
}: {
    notification: ProductAcceptedNotification;
}) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}
        >
            <ProductTable product={notification.product!} />

            {/* 🔹 Botón Ver producto si está permitido */}
            {notification.canViewProduct && (
                <Link
                    href={`/buy/${notification.product!.id}`}
                    className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition duration-300 inline-block text-center"
                >
                    Ver producto
                </Link>
            )}
            {/* En aceptado no se muestra nada más, aunque existan otros flags */}
        </NotificationWrapper>
    );
}

// PRODUCT_REJECTED
export function ProductRejectedView({
    notification,
}: {
    notification: ProductRejectedNotification;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEditClick = () => {
        if (!notification.product) {
            Swal.fire("Error", "No hay producto para editar", "error");
            return;
        }

        try {
            setLoading(true);
            router.push(`/edit/${notification.product.id}`);
        } catch (e) {
            Swal.fire("Error", "No se pudo editar el producto", "error");
        } finally {
            setLoading(false); // SIEMPRE se ejecuta
        }
    };


    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            {/* 🔹 Razón del rechazo */}
            <p className="text-red-500 mb-4 text-center font-medium">
                Razón: {notification.rejectionReason}
            </p>

            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />

            {/* 🔹 Botón Editar producto si está permitido */}
            {notification.canEditProduct && (
                <button
                    onClick={handleEditClick}
                    className="mt-4 w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:scale-105 transition duration-300"
                    disabled={loading}
                >
                    Editar producto
                </button>
            )}
        </NotificationWrapper>
    );
}




// ---------- INTEREST_MARKED ----------
export function InterestMarkedView({
    notification,
}: {
    notification: InterestMarkedNotification;
}) {
    const [loading, setLoading] = useState(false);


    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="buyer"
                user_name={notification.buyerInfo.user_name}
                avatarUrl={notification.buyerInfo.avatarUrl}
            />


            {notification.requestReason && (
                <p className="mb-4 text-center italic text-black dark:text-white">
                    Motivo: "{notification.requestReason}"
                </p>
            )}

            {/* 🔹 Tabla del producto */}
            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />

            {/* 🔹 Botones de interacción si está permitido */}
            {notification.canInteract && (
                <div className="mt-4 flex gap-4">
                    <button
                        //onClick={() => handleAcceptInterest(notification.buyerInfo.id, notification.transactionId!)}
                        onClick={() => handleAcceptInterest(
                            notification.buyerInfo.id,
                            notification.transactionId!,
                            setLoading
                        )}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 transition duration-300"
                        disabled={loading}
                    >
                        Aceptar interés
                    </button>


                    <button
                        onClick={() =>
                            handleRejectInterest(
                                notification.buyerInfo.id,
                                notification.transactionId!,
                                setLoading
                            )
                        }
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:scale-105 transition duration-300"
                        disabled={loading}
                    >
                        Rechazar interés
                    </button>


                </div>
            )}
            {notification.canGoToChat && notification.chatId && (
                <Link
                    href={`/chats/${notification.chatId}`}
                    className="mt-6 w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 transition duration-300 inline-block text-center"
                >
                    Ir al chat
                </Link>
            )}

        </NotificationWrapper>
    );
}


// ---------- INTEREST_ACCEPTED ----------
export function InterestAcceptedView({ notification }: { notification: InterestAcceptedNotification }) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />


            <ProductTable product={notification.product!} />

            {notification.canGoToChat && notification.chatId && (
                <Link
                    href={`/chats/${notification.chatId}`}
                    className="mt-6 w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:scale-105 transition duration-300 inline-block text-center"
                >
                    Ir al chat
                </Link>
            )}

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}


// ---------- INTEREST_REJECTED ----------
export function InterestRejectedView({ notification }: { notification: InterestRejectedNotification }) {
    console.log(notification);
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />

            {notification.rejectionReason && (
                <p className="text-red-500 mb-4 text-center font-medium">
                    Razón: {notification.rejectionReason}
                </p>
            )}

            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}


// ---------- INTEREST_CANCELLED ----------
export function InterestCancelledView({ notification }: { notification: InterestCancelledNotification }) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="buyer"
                user_name={notification.buyerInfo.user_name}
                avatarUrl={notification.buyerInfo.avatarUrl}
            />

            <p className="text-red-500 mb-4 text-center font-medium">
                Motivo: {notification.cancellationReason}
            </p>
            <ProductTable product={notification.product!} />
            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}

// ---------- SELLER_CANCELLED_TRANSACTION ----------
export function SellerCancelledTransactionView({ notification }: { notification: SellerCancelledTransactionNotification }) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />
            <p className="text-red-500 mb-4 text-center font-medium">
                Motivo: {notification.cancellationReason}
            </p>

            <ProductTable product={notification.product!} />
            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}

// ---------- BUYER_CANCELLED_TRANSACTION ----------
export function BuyerCancelledTransactionView({ notification }: { notification: BuyerCancelledTransactionNotification }) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="buyer"
                user_name={notification.buyerInfo.user_name}
                avatarUrl={notification.buyerInfo.avatarUrl}
            />
            <p className="text-red-500 mb-4 text-center font-medium">
                Motivo: {notification.cancellationReason}
            </p>

            <ProductTable product={notification.product!} />
            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}

// ---------- DELIVERY_MARKED ----------
export function DeliveryMarkedView({ notification }: { notification: DeliveryMarkedNotification }) {
    const [loading, setLoading] = useState(false);
    const handleConfirmDelivery = async (transactionId: string) => {
        // Paso 1: confirmación con Swal
        const confirm = await Swal.fire({
            title: "Confirmar entrega",
            text: "¿Confirmas que recibiste el producto correctamente?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "No",
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            // Paso 2: simular llamada a API
            await api.patch(`/transactions/${transactionId}/confirm-delivery`);


            // Paso 3: éxito
            Swal.fire(
                "Entrega confirmada",
                "Has confirmado la entrega correctamente.",
                "success"
            ).then(() => {
                window.location.reload();
            });
        } catch (error) {
            Swal.fire("Error", "No se pudo confirmar la entrega.", "error");
        } finally {
            // Desbloquear
            setLoading(false);
        }
    };

    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />

            <ProductTable product={notification.product!} />

            {/* Botón "Recibí el producto" si puede interactuar */}
            {notification.canInteract && (
                <button
                    onClick={() => handleConfirmDelivery(notification.transactionId)}
                    disabled={loading}
                    className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:scale-105 transition duration-300"
                >
                    Confirmar de recibido
                </button>
            )}

            {/* Botón "Ver producto" */}
            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}


// ---------- COMPLETION_CONFIRMED ----------
export function CompletionConfirmedSellerView({
    notification,
}: {
    notification: CompletionConfirmedSellerNotification;
}) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="buyer"
                user_name={notification.buyerInfo.user_name}
                avatarUrl={notification.buyerInfo.avatarUrl}
            />

            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}

export function CompletionConfirmedBuyerView({
    notification,
}: {
    notification: CompletionConfirmedBuyerNotification;
}) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />

            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}



// ---------- SOLD_OUT_TOTAL ----------
export function SoldOutTotalView({ notification }: { notification: SoldOutTotalNotification }) {
    const [loading, setLoading] = useState(false);
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />

            {notification.canInteract && (
                <div className="mt-6 space-y-3">

                    {/* Cancelar interés */}
                    <button
                        disabled={loading}
                        onClick={() =>
                            handleCancelInterestSoldOut(notification.transactionId!, setLoading)
                        } className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Cancelar interés (sin sanción)
                    </button>

                    {/* Aviso al aumentar cantidad disponible */}
                    <button
                        disabled={loading}
                        onClick={() =>
                            notifyAnyIncreaseAction({
                                transactionId: notification.transactionId!,
                                setLoadingAction: setLoading
                            })
                        }

                        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Avisarme si la cantidad disponible aumenta
                    </button>

                    {/* Aviso hasta llegar a la cantidad solicitada */}
                    <button
                        disabled={loading}
                        onClick={() =>
                            notifyUntilFullAction({
                                transactionId: notification.transactionId!,
                                setLoadingAction: setLoading
                            })
                        }

                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Avisarme cuando haya suficiente cantidad
                    </button>
                </div>
            )}
        </NotificationWrapper>
    );
}


// ---------- SOLD_OUT_PARTIAL ----------
export function SoldOutPartialView({ notification }: { notification: SoldOutPartialNotification }) {
    console.log(notification);
    const [loading, setLoading] = useState(false);

    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />

            {notification.canInteract && (
                <div className="mt-6 space-y-3">

                    <button
                        disabled={loading}
                        onClick={() =>
                            handleCancelInterestSoldOut(
                                notification.transactionId!,
                                setLoading
                            )
                        }


                        className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Cancelar interés (sin sanción)
                    </button>

                    <button
                        disabled={loading}
                        onClick={() =>
                            adjustQuantityRequestedAction({
                                transactionId: notification.transactionId!,
                                available: notification.product!.availableQuantity,
                                setLoadingAction: setLoading
                            })
                        }
                        className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Modificar cantidad solicitada
                    </button>

                    <button
                        disabled={loading}
                        onClick={() =>
                            notifyAnyIncreaseAction({
                                transactionId: notification.transactionId!,
                                setLoadingAction: setLoading
                            })
                        }
                        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Avisarme si la cantidad disponible aumenta
                    </button>

                    <button
                        disabled={loading}
                        onClick={() =>
                            notifyUntilFullAction({
                                transactionId: notification.transactionId!,
                                setLoadingAction: setLoading
                            })
                        }
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:scale-105 transition"
                    >
                        Avisarme cuando haya suficiente cantidad
                    </button>

                </div>
            )}
        </NotificationWrapper>
    );
}

// ---------- NOTIFY_AVAILABLE_ANY ----------
export function NotifyAvailableAnyView({
    notification
}: {
    notification: AvailableAnyNotification;
}) {
    const [loading, setLoading] = useState(false);

    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />
            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />

            {notification.canInteract && (
                <div className="mt-6 flex flex-col gap-3">

                    <button
                        disabled={loading}
                        onClick={() =>
                            cancelInterestAction({
                                transactionId: notification.transactionId,
                                setLoadingAction: setLoading,
                            })
                        }
                        className="w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                    >
                        Cancelar petición
                    </button>

                    <button
                        disabled={loading}
                        onClick={() =>
                            adjustQuantityRequestedAction({
                                transactionId: notification.transactionId!,
                                available: notification.product!.availableQuantity,
                                setLoadingAction: setLoading
                            })
                        }
                        className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                    >
                        Ajustar cantidad solicitada
                    </button>

                    <button
                        disabled={loading}
                        onClick={() =>
                            notifyUntilFullAction({
                                transactionId: notification.transactionId!,
                                setLoadingAction: setLoading
                            })
                        }
                        className="w-full rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700"
                    >
                        Esperar cantidad completa
                    </button>
                </div>
            )}
        </NotificationWrapper>
    );
}


// ---------- NOTIFY_AVAILABLE_FULL ----------
export function NotifyAvailableFullView({
    notification
}: {
    notification: AvailableFullNotification;
}) {
    const [loading, setLoading] = useState(false);

    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="seller"
                user_name={notification.sellerInfo.user_name}
                avatarUrl={notification.sellerInfo.avatarUrl}
            />

            <ProductTable product={notification.product!} />

            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />

            {notification.canInteract && (
                <div className="mt-6 flex flex-col gap-3">

                    {/* Cancelar petición */}
                    <button
                        disabled={loading}
                        onClick={() =>
                            cancelInterestAction({
                                transactionId: notification.transactionId,
                                setLoadingAction: setLoading,
                            })
                        }
                        className="w-full rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                    >
                        Cancelar petición
                    </button>

                    {/* Confirmar y continuar */}
                    <button
                        disabled={loading}
                        onClick={() =>
                            confirmAndContinueAction({
                                transactionId: notification.transactionId!,
                                setLoadingAction: setLoading,
                            })
                        }
                    >
                        Confirmar y continuar
                    </button>
                </div>
            )}
        </NotificationWrapper>
    );
}


// ---------- BUYER_WAIT_ANY ----------
export function BuyerWaitAnyView({ notification }: { notification: BuyerWaitAnyNotification }) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="buyer"
                user_name={notification.buyerInfo.user_name}
                avatarUrl={notification.buyerInfo.avatarUrl}
            />
            <ProductTable product={notification.product!} />
            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}

// ---------- BUYER_WAIT_FULL ----------
export function BuyerWaitFullView({ notification }: { notification: BuyerWaitFullNotification }) {
    return (
        <NotificationWrapper
            title={getNotificationTitle(notification.type)}
            message={notification.message}
        //interactionMessage={notification.interactionMessage}

        >
            <UserInfoCard
                role="buyer"
                user_name={notification.buyerInfo.user_name}
                avatarUrl={notification.buyerInfo.avatarUrl}
            />
            <ProductTable product={notification.product!} />
            <ViewProductButton
                canViewProduct={notification.canViewProduct}
                productId={notification.product!.id}
            />
        </NotificationWrapper>
    );
}

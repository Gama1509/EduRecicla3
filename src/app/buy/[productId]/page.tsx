'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "@/utils/api";
import { ProductDetailsWithStateDto, ProductUserState } from "@/types/product-details-with-state.dto";
import { ProductCategory } from "@/types/product-details.dto";
import { confirmDeliveryAction } from "@/app/notifications/views/NotificationViews";




export const cancelInterestAction = async ({
    transactionId,
    setLoadingAction,
}: {
    transactionId: string | undefined;
    setLoadingAction: (loading: boolean) => void;
}) => {

    // 🔹 Paso 1: Confirmación inicial
    const confirm = await Swal.fire({
        title: "¿Cancelar tu interés?",
        text: "No recibirás la sanción habitual de 15 días sin poder interesarte por el producto por esta cancelación.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return; // El usuario canceló

    // 🔹 Paso 2: Pedir la razón de cancelación
    const { value: cancelReason, isConfirmed: reasonConfirmed } = await Swal.fire({
        title: "Razón de cancelación",
        text: "Por favor indica la razón de cancelación. Esto es obligatorio.",
        icon: "question",
        input: "text",
        inputPlaceholder: "Escribe tu razón...",
        inputValidator: (value) => {
            if (!value) {
                return "Debes escribir una razón para cancelar";
            }
            return null;
        },
        showCancelButton: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
    });

    if (!reasonConfirmed) return; // El usuario canceló en este paso

    try {
        setLoadingAction(true); // Bloquear todos los botones de acción

        // Llamada a API con la razón proporcionada
        await api.post(`/transactions/cancelInterest`, {
            transactionId: transactionId,
            cancelReason: cancelReason,
        });

        await Swal.fire(
            "Interés cancelado",
            "Tu interés fue cancelado correctamente.",
            "success"
        );

        window.location.reload();
    } catch (error) {
        Swal.fire("Error", "No se pudo cancelar el interés.", "error");
    } finally {
        setLoadingAction(false);
    }
};


export default function ProductPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState<ProductDetailsWithStateDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantityInterest, setQuantityInterest] = useState(1);
    const [sendingInterest, setSendingInterest] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    // Función para mostrar cualquier valor
    const display = (value: any, fallback = "Sin información") =>
        value !== null && value !== undefined ? value : fallback;

    // Función específica para booleanos
    const displayBoolean = (value: boolean | null | undefined) =>
        value === true ? "Sí" : value === false ? "No" : "Sin información";

    // Función para mostrar interés
    const handleShowInterest = async () => {
        if (!product) return;

        if (product.userState === ProductUserState.MostrarInteres) {
            if (product.availableQuantity === 0) {
                Swal.fire("Agotado", "Este producto no tiene unidades disponibles actualmente.", "warning");
                return;
            }

            const cantidad = Number(quantityInterest) || 1;

            // 🔹 Validar que sea un número entero dentro del rango permitido
            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > product.availableQuantity) {
                Swal.fire(
                    "Cantidad inválida",
                    `Debes ingresar un número entre 1 y ${product.availableQuantity} unidades disponibles.`,
                    "warning"
                );
                return;
            }


            const confirmResult = await Swal.fire({
                title: "Mostrar interés",
                text: `¿Seguro que quieres mostrar interés en ${cantidad} ${product.name}? Se enviará una notificación al vendedor. El vendedor revisará tu solicitud y, en caso de aceptarte, recibirás una notificación para que puedan comunicarse. En caso de ser rechazado, no podrás volver a mostrar interés por 15 días.`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, continuar",
                cancelButtonText: "Cancelar",
            });

            if (confirmResult.isConfirmed) {
                // 🔹 Segundo Swal para pedir mensaje opcional
                const { value: message } = await Swal.fire({
                    title: "Razón (opcional)",
                    input: "textarea",
                    inputLabel: "Puedes explicar por qué te interesa este producto (opcional)",
                    inputPlaceholder: "Escribe tu mensaje aquí...",
                    inputAttributes: {
                        "aria-label": "Tu mensaje",
                    },
                    showCancelButton: true,
                    confirmButtonText: "Enviar",
                    cancelButtonText: "Omitir",
                });

                // Si cancela, no enviar nada
                if (message === undefined) return;

                setSendingInterest(true);
                try {
                    // 🔹 Construir payload
                    const payload: any = {
                        sellerId: product.ownerId,
                        productId: product.id,
                        quantityRequested: Number(quantityInterest),
                        message: message?.trim() || null, // null si vacío
                    };

                    // 🔹 Enviar al backend
                    await api.post("/transactions/show-interest", payload);

                    await Swal.fire({
                        icon: "success",
                        title: "Interés enviado",
                        text: "El vendedor ha sido notificado correctamente de tu interés. Por favor, espera su respuesta.",
                        confirmButtonText: "Entendido",
                    });

                    window.location.reload();
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "No se pudo registrar tu interés.", "error");
                } finally {
                    setSendingInterest(false);
                }
            }

        }
        else if (product.userState === ProductUserState.Pending) {
            const result = await Swal.fire({
                title: "Cancelar solicitud",
                text: "Tu solicitud está pendiente. ¿Deseas cancelarla? No hay penalización.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No",
            });

            if (result.isConfirmed) {
                try {
                    await api.post(`/transactions/${product.id}/cancel`);
                    Swal.fire("Cancelado", "Tu solicitud ha sido cancelada.", "success");
                    setProduct({ ...product, userState: ProductUserState.MostrarInteres });
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "No se pudo cancelar la solicitud.", "error");
                }
            }
        }
        else if (product.userState === ProductUserState.InProgress) {
            const result = await Swal.fire({
                title: "Cancelar transacción",
                text: `Actualmente estás en proceso de obtener este producto. Si cancelas, no podrás volver a mostrar interés por 15 días.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No",
            });

            if (result.isConfirmed) {
                try {
                    await api.post(`/transactions/${product.id}/cancel`);
                    Swal.fire("Cancelado", "La transacción ha sido cancelada.", "success");
                    setProduct({ ...product, userState: ProductUserState.Cancelled, daysLeft: 15 });
                } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "No se pudo cancelar la transacción.", "error");
                }
            }
        }
    };



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log("id del producto", productId);
                const res = await api.get<ProductDetailsWithStateDto>(`/products/with-state/${productId}`);
                setProduct(res.data);
                console.log(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <p className="text-center">Cargando...</p>;
    if (!product) return <p className="text-center text-red-500">Producto no encontrado.</p>;

    // Mensaje según userState
    const renderUserStateMessage = () => {
        if (!product) return null;

        // Función auxiliar para el botón con loading
        const ActionButton = ({
            label,
            onClick,
            color = "black",
        }: {
            label: string;
            onClick: () => void;
            color?: "black" | "green" | "yellow" | "orange";
        }) => {
            const colorClasses = {
                black: "bg-black hover:border-blue-500 hover:shadow-[0_0_10px_#3b82f6]",
                green: "bg-green-500 hover:scale-105",
                yellow: "bg-black hover:border-yellow-500 hover:shadow-[0_0_10px_#eab308]",
                orange: "bg-black hover:border-orange-500 hover:shadow-[0_0_10px_#f97316]",
            };

            return (
                <button
                    className={`mt-2 px-4 py-2 rounded text-white font-semibold transition duration-300 border-2 border-white ${colorClasses[color]} ${loadingAction ? "opacity-70 cursor-not-allowed" : ""}`}
                    onClick={onClick}
                    disabled={loadingAction}
                >
                    {loadingAction ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                        </div>
                    ) : (
                        label
                    )}
                </button>
            );
        };

        switch (product.userState) {
            // --- Mostrar interés ---
            case ProductUserState.MostrarInteres:
                if (product.availableQuantity === 0) {
                    return (
                        <div className="text-center text-white font-semibold">
                            Actualmente no hay stock disponible. Pronto volverá a estar disponible, no olvide revisar frecuentemente.
                        </div>
                    );
                }
                return (
                    <div className="text-center text-white font-semibold space-y-3">
                        <div>
                            <label htmlFor="quantityInterest" className="mr-2">Cantidad a solicitar:</label>
                            <input
                                id="quantityInterest"
                                type="number"
                                min={1}
                                max={product.availableQuantity ?? 1}
                                value={quantityInterest}
                                onChange={(e) => setQuantityInterest(Number(e.target.value))}
                                className="w-20 rounded px-2 py-1 border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-black"
                            />
                        </div>
                        <ActionButton label="Mostrar interés" onClick={handleShowInterest} color="black" />
                    </div>
                );

            // --- Pending (sin sanción) ---
            case ProductUserState.Pending:
                return (
                    <div className="text-white font-semibold text-center space-y-4">
                        <p>
                            Ya has enviado tu solicitud de interés. Por favor espera a que el vendedor revise tu caso.
                        </p>
                        <div>
                            <ActionButton
                                label="Cancelar solicitud"
                                onClick={() =>
                                    cancelInterestAction({
                                        transactionId: product.transactionId,
                                        setLoadingAction,
                                    })
                                }
                                color="yellow"
                            />
                        </div>
                    </div>
                );


            // --- In Progress (con sanción) ---
            case ProductUserState.InProgress:
                return (
                    <div className="text-white font-semibold text-center">
                        Actualmente estás en proceso de obtener este producto. Revisa tus transacciones.
                        {/*}            <ActionButton label="Cancelar transacción" onClick={() => handleCancelInterest(true)} color="orange" />{*/}
                    </div>
                );

            // --- Cancelled (espera de días) ---
            case ProductUserState.Cancelled:
                return (
                    <div className="text-white font-semibold text-center">
                        Recientemente cancelaste o tu solicitud fue rechazada. Debes esperar {product.daysLeft} días para volver a mostrar interés.
                    </div>
                );

            // --- Stock agotado / Notificaciones ---
            case ProductUserState.SoldOutTotal:
            case ProductUserState.SoldOutPartial:
            case ProductUserState.NotifyAvailableAny:
            case ProductUserState.NotifyAvailableFull:
                return (
                    <div className="text-white font-semibold text-center space-y-2">
                        <div>Para más información sobre tu caso con este producto, revisa tus notificaciones.</div>
                        {/*}                    <ActionButton label="Cancelar notificación" onClick={() => handleCancelNotification()} color="yellow" />{*/}
                    </div>
                );

            // --- Delivered ---
            case ProductUserState.Delivered:
                return (
                    <div className="text-white font-semibold text-center">
                        El vendedor ha marcado tu pedido como entregado.
                        <ActionButton label="Confirmar de recibido"
                            onClick={() =>
                                confirmDeliveryAction({
                                    transactionId: product.transactionId!,
                                    setLoadingAction: setLoading,
                                })
                            } color="green" />
                    </div>
                );

            // --- Owner ---
            case ProductUserState.Owner:
                return (
                    <div className="text-white font-semibold text-center">
                        Este es tu producto, no puedes mostrar interés en él.
                    </div>
                );

            // --- Not logged in ---
            case ProductUserState.NotLoggedIn:
                return (
                    <div className="text-center text-white font-semibold">
                        Para comprar debes{' '}
                        <a
                            href="/login"
                            className="font-bold underline transition-transform duration-300 hover:scale-110"
                        >
                            Iniciar Sesión
                        </a>
                    </div>
                );

            default:
                return null;
        }
    };



    return (
        <div className="p-8 space-y-10">
            <div className="flex justify-center">
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 rounded font-semibold text-white bg-black border border-white hover:shadow-[0_0_10px_yellow] transition-all"
                >
                    ← Regresar
                </button>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">{display(product.name)}</h1>
                <p><strong>Vendedor:</strong> {display(product.owner_name)}</p>
            </div>

            {/* Images */}
            {product.imageUrls?.length ? (
                <div className="flex justify-center flex-wrap gap-6 mb-6">
                    {product.imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Sin imágenes disponibles</p>
            )}

            {/* General Info */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
                    Información General
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                        <li><strong>ID:</strong> {display(product.id)}</li>
                        <li><strong>Marca:</strong> {display(product.brand)}</li>
                        <li><strong>Modelo:</strong> {display(product.model)}</li>
                        <li><strong>Condición:</strong> {display(product.condition)}</li>
                        <li><strong>Tipo:</strong> {display(product.type)}</li>
                        <li><strong>Status:</strong> {display(product.status)}</li>
                        <li><strong>Precio:</strong> {display(product.price)}</li>
                        <li><strong>Cantidad disponible:</strong> {display(product.availableQuantity)}</li>
                    </ul>
                    <ul className="space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                        <li><strong>Categoría:</strong> {display(product.category)}</li>
                        <li><strong>Procesador:</strong> {display(product.processor)}</li>
                        <li><strong>RAM:</strong> {display(product.ram)}</li>
                        <li><strong>Almacenamiento:</strong> {display(product.storageCapacity)} {display(product.storageType)}</li>
                        <li><strong>Color:</strong> {display(product.color)}</li>
                        <li><strong>Peso:</strong> {display(product.weight)}</li>
                        <li><strong>Dimensiones:</strong> {display(product.dimensions)}</li>
                        <li><strong>Sistema Operativo:</strong> {display(product.operatingSystem)}</li>
                    </ul>
                </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">
                    Especificaciones Técnicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-secondary-light dark:text-text-secondary-dark">
                    <ul className="space-y-2">
                        <li><strong>Motherboard:</strong> {display(product.motherboard)}</li>
                        <li><strong>Tarjeta Gráfica:</strong> {display(product.graphicsCard)}</li>
                        <li><strong>Puertos USB:</strong> {display(product.usbPorts)}</li>
                        <li><strong>Puertos HDMI:</strong> {display(product.hdmiPorts)}</li>
                        <li><strong>Puertos de Audio:</strong> {display(product.audioPorts)}</li>
                        <li><strong>Ethernet:</strong> {displayBoolean(product.ethernetPort)}</li>
                    </ul>
                    <ul className="space-y-2">
                        <li><strong>WiFi:</strong> {displayBoolean(product.wifi)}</li>
                        <li><strong>Bluetooth:</strong> {displayBoolean(product.bluetooth)}</li>
                        {product.category === ProductCategory.LAPTOP && product.laptopSpecs && (
                            <>
                                <li><strong>Estado de Batería:</strong> {display(product.laptopSpecs.batteryHealth)}</li>
                                <li><strong>Tamaño de Pantalla:</strong> {display(product.laptopSpecs.screenSize)}</li>
                                <li><strong>Webcam:</strong> {displayBoolean(product.laptopSpecs.webcam)}</li>
                                <li><strong>Tipo de Teclado:</strong> {display(product.laptopSpecs.keyboardType)}</li>
                            </>
                        )}
                        {product.category === ProductCategory.PC && product.pcSpecs && (
                            <>
                                <li><strong>Tipo de Case:</strong> {display(product.pcSpecs.caseType)}</li>
                                <li><strong>Fuente de Poder:</strong> {display(product.pcSpecs.powerSupply)}</li>
                                <li><strong>Disipador CPU:</strong> {display(product.pcSpecs.cpuCooler)}</li>
                                <li><strong>Ventiladores:</strong> {display(product.pcSpecs.fans)}</li>
                                <li><strong>Monitor Incluido:</strong> {displayBoolean(product.pcSpecs.monitorIncluded)}</li>
                                <li><strong>Teclado Incluido:</strong> {displayBoolean(product.pcSpecs.keyboardIncluded)}</li>
                                <li><strong>Mouse Incluido:</strong> {displayBoolean(product.pcSpecs.mouseIncluded)}</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-semibold mb-2 text-text-primary-light dark:text-text-primary-dark">
                    Notas
                </h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {product.notes ? product.notes : "Sin notas"}
                </p>
            </div>

            {/* Description */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                <h2 className="text-2xl font-semibold mb-2 text-text-primary-light dark:text-text-primary-dark">
                    Descripción
                </h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">{display(product.description)}</p>
            </div>

            {/* User State / Acciones */}
            <div className="flex justify-center mt-8">
                {renderUserStateMessage()}
            </div>
        </div>
    );
}

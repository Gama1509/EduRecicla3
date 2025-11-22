'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Product, ProductCategory, ProductStatus } from "@/types/product-details.dto";
import Swal from "sweetalert2";

export default function ProductViewPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Función para mostrar cualquier valor
    const display = (value: any, fallback = "Sin información") =>
        value !== null && value !== undefined ? value : fallback;

    // Función específica para booleanos
    const displayBoolean = (value: boolean | null | undefined) =>
        value === true ? "Sí" : value === false ? "No" : "Sin información";

    // Cambiar status del producto
    const handleStatusChange = async (newStatus: ProductStatus) => {
        if (!product) return;

        try {
            let reason: string | undefined;

            if (newStatus === ProductStatus.REJECTED) {
                // Si es rechazo, pedir razón obligatoria
                const { value: inputReason } = await Swal.fire({
                    title: 'Rechazar Producto',
                    input: 'textarea',
                    inputLabel: 'Escribe la razón del rechazo',
                    inputPlaceholder: 'Motivo del rechazo...',
                    inputAttributes: {
                        'aria-label': 'Escribe la razón del rechazo'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Enviar',
                    cancelButtonText: 'Cancelar',
                    preConfirm: (text) => {
                        if (!text || text.trim() === '') {
                            Swal.showValidationMessage('La razón es obligatoria');
                            return false; // Evita cerrar el modal
                        }
                        return text.trim();
                    }
                });

                if (!inputReason || inputReason.trim() === '') {
                    // Por seguridad, validar también aquí
                    await Swal.fire('Error', 'Debes escribir una razón para el rechazo.', 'error');
                    return;
                }

                reason = inputReason.trim();

            } else if (newStatus === ProductStatus.APPROVED) {
                // Confirmación antes de aprobar
                const confirmResult = await Swal.fire({
                    title: '¿Aceptar Producto?',
                    text: '¿Estás seguro de aprobar este producto?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, aprobar',
                    cancelButtonText: 'Cancelar'
                });

                if (!confirmResult.isConfirmed) return; // Si cancelan, salir
            }

            // DTO a enviar
            const updateDto = {
                productId: product.id,
                status: newStatus,
                reason
            };

            // Enviar PATCH al backend
            await api.patch('/products/status', updateDto);

            await Swal.fire({
                title: '¡Éxito!',
                text: `El producto ha sido ${newStatus === ProductStatus.APPROVED ? 'aprobado' : 'rechazado'} correctamente.`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            // Actualizar estado local
            setProduct({ ...product, status: newStatus });

            // Volver a la página anterior
            window.history.back();

        } catch (err) {
            console.error('Error updating status:', err);
            Swal.fire('Error', 'No se pudo actualizar el status del producto.', 'error');
        }
    };







    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<Product>(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p className="text-center text-text-primary-light dark:text-text-primary-dark">Cargando...</p>;
    if (!product) return <p className="text-center text-red-500">Producto no encontrado.</p>;

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
                <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {display(product.name)}
                </h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
                    <strong>Owner:</strong> {display(product.owner_name)}
                </p>


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

            {/* General Information */}
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
                        <li><strong>Stock:</strong> {display(product.stock)}</li>
                        <li><strong>Cantidad Disponible:</strong> {display(product.availableQuantity)}</li>
                        <li><strong>Cantidad Reservada:</strong> {display(product.reservedQuantity)}</li>
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

            {/* Technical Specifications */}
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
            {/* Status / Acciones */}
            <div className="flex justify-center mt-8">
                {product.status === 'Pending' && (
                    <div className="flex justify-center gap-12">
                        <button
                            className="px-8 py-3 text-lg rounded-lg bg-black/70 border border-lime-500 text-white font-semibold transition-all duration-300 hover:text-green-400 hover:shadow-[0_0_15px_limegreen] hover:scale-110"
                            onClick={() => handleStatusChange(ProductStatus.APPROVED)}
                        >
                            Aceptar
                        </button>
                        <button
                            className="px-8 py-3 text-lg rounded-lg bg-black/70 border border-red-500 text-white font-semibold transition-all duration-300 hover:text-red-400 hover:shadow-[0_0_15px_red] hover:scale-110"
                            onClick={() => handleStatusChange(ProductStatus.REJECTED)}
                        >
                            Rechazar
                        </button>
                    </div>
                )}
            </div>

        </div>

    );
}

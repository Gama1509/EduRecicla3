'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "@/utils/api";
import { ProductDetailsWithStateDto, ProductUserState } from "@/types/product-details-with-state.dto";

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductDetailsWithStateDto | null>(null);
    const [loading, setLoading] = useState(true);

    const display = (value: any, fallback = "Sin información") =>
        value !== null && value !== undefined ? value : fallback;

    const displayBoolean = (value: boolean | null | undefined) =>
        value === true ? "Sí" : value === false ? "No" : "Sin información";

    const handleShowInterest = async () => {
        if (!product) return;

        switch (product.userState) {
            case ProductUserState.MostrarInteres:
                const confirm = await Swal.fire({
                    title: "Mostrar interés",
                    text: "Se enviará una notificación al vendedor. Él decidirá si acepta tu solicitud. ¿Deseas continuar?",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "Sí, enviar",
                    cancelButtonText: "Cancelar",
                });

                if (confirm.isConfirmed) {
                    try {
                        await api.post(`/transactions`, { productId: product.id });
                        Swal.fire("¡Interés enviado!", "El vendedor recibirá tu solicitud.", "success");
                        setProduct({ ...product, userState: ProductUserState.Pending });
                    } catch (err) {
                        console.error(err);
                        Swal.fire("Error", "No se pudo enviar la solicitud.", "error");
                    }
                }
                break;

            case ProductUserState.Pending:
                Swal.fire("Solicitud pendiente", "Tu solicitud ya fue enviada al vendedor. Puedes cancelarla si deseas.", "info");
                break;

            case ProductUserState.InProgress:
                Swal.fire("En proceso", "Actualmente estás en proceso con este producto. Si cancelas, no podrás volver a mostrar interés por 15 días.", "info");
                break;

            case ProductUserState.Cancelled:
                Swal.fire("Espera 15 días", `Recientemente cancelaste o te rechazaron la solicitud. Debes esperar ${product.daysLeft} días para volver a mostrar interés.`, "info");
                break;
        }
    };

    const handleCancel = async () => {
        if (!product) return;

        if (![ProductUserState.Pending, ProductUserState.InProgress].includes(product.userState)) return;

        let title = product.userState === ProductUserState.Pending ? "Cancelar solicitud" : "Cancelar proceso";
        let text =
            product.userState === ProductUserState.Pending
                ? "¿Deseas cancelar tu solicitud? Esto no tiene penalización."
                : "Si cancelas el proceso, no podrás volver a mostrar interés por 15 días. ¿Deseas continuar?";

        const confirm = await Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No",
        });

        if (confirm.isConfirmed) {
            try {
                await api.patch(`/transactions/${product.id}/cancel`);
                Swal.fire("Cancelado", "Tu solicitud ha sido cancelada.", "success");

                const newState =
                    product.userState === ProductUserState.Pending
                        ? ProductUserState.MostrarInteres
                        : ProductUserState.Cancelled;

                const newDaysLeft = product.userState === ProductUserState.InProgress ? 15 : undefined;

                setProduct({ ...product, userState: newState, daysLeft: newDaysLeft });
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo cancelar la solicitud.", "error");
            }
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get<ProductDetailsWithStateDto>(`/products/with-state/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p className="text-center">Cargando...</p>;
    if (!product) return <p className="text-center text-red-500">Producto no encontrado.</p>;

    return (
        <div className="p-8 space-y-10">

            <div className="flex justify-center">
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 rounded font-semibold text-white bg-black hover:shadow-lg"
                >
                    ← Regresar
                </button>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">{display(product.name)}</h1>
                <p><strong>Owner:</strong> {display(product.owner_name)}</p>
            </div>

            {product.imageUrls?.length ? (
                <div className="flex justify-center flex-wrap gap-6 mb-6">
                    {product.imageUrls.map((url, i) => (
                        <img key={i} src={url} alt={`Imagen ${i + 1}`} className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-lg shadow-lg" />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500">Sin imágenes disponibles</p>}

            {/* Información general */}
            <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Información General</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul>
                        <li><strong>ID:</strong> {display(product.id)}</li>
                        <li><strong>Marca:</strong> {display(product.brand)}</li>
                        <li><strong>Modelo:</strong> {display(product.model)}</li>
                        <li><strong>Condición:</strong> {display(product.condition)}</li>
                        <li><strong>Tipo:</strong> {display(product.type)}</li>
                        <li><strong>Status:</strong> {display(product.status)}</li>
                        <li><strong>Precio:</strong> {display(product.price)}</li>
                        <li><strong>Cantidad:</strong> {display(product.quantity)}</li>
                    </ul>
                    <ul>
                        <li><strong>Categoría:</strong> {display(product.category)}</li>
                        <li><strong>Procesador:</strong> {display(product.processor)}</li>
                        <li><strong>RAM:</strong> {display(product.ram)}</li>
                        <li><strong>Almacenamiento:</strong> {display(product.storageCapacity)} {display(product.storageType)}</li>
                        <li><strong>Color:</strong> {display(product.color)}</li>
                        <li><strong>Peso:</strong> {display(product.weight)}</li>
                        <li><strong>Dimensiones:</strong> {display(product.dimensions)}</li>
                    </ul>
                </div>
            </div>

            {/* Botón o mensaje según estado */}
            <div className="flex flex-col items-center mt-8 gap-4">
                {product.userState === ProductUserState.MostrarInteres && (
                    <button
                        className="px-6 py-3 text-lg rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleShowInterest}
                    >
                        Mostrar Interés
                    </button>
                )}

                {(product.userState === ProductUserState.Pending || product.userState === ProductUserState.InProgress) && (
                    <>
                        <p className={`text-center ${product.userState === ProductUserState.Pending ? 'text-yellow-700' : 'text-green-700'}`}>
                            {product.userState === ProductUserState.Pending
                                ? 'Tu solicitud de interés ya fue enviada. Puedes cancelarla si deseas.'
                                : 'Actualmente estás en proceso con este producto. Puedes cancelar el proceso si lo deseas.'}
                        </p>
                        <button
                            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            onClick={handleCancel}
                        >
                            Cancelar {product.userState === ProductUserState.Pending ? 'solicitud' : 'proceso'}
                        </button>
                    </>
                )}

                {product.userState === ProductUserState.Cancelled && (
                    <p className="text-center text-red-500">
                        Recientemente cancelaste o te rechazaron la solicitud. Debes esperar {product.daysLeft} días para volver a mostrar interés.
                    </p>
                )}
            </div>

        </div>
    );
}

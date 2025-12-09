'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { ProductsTableDto } from '@/types/products-table.dto';
import { ProductCategory, ProductCondition, ProductStatus, ProductType, RAMSize, StorageCapacity, StorageType } from '@/types/product-details.dto';
import { productTypeLabels, productConditionLabels, productStatusLabels } from '@/constants/productLabels';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function MyProducts() {
    const [products, setProducts] = useState<ProductsTableDto[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    // Filtros
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCondition, setFilterCondition] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterRAM, setFilterRAM] = useState('');
    const [filterStorageType, setFilterStorageType] = useState('');
    const [filterStorageCapacity, setFilterStorageCapacity] = useState('');
    const [searchName, setSearchName] = useState('');

    // Cargar productos
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await api.get<ProductsTableDto[]>('/products/my-products');
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center text-white p-8">Cargando productos...</div>;

    // Filtrar productos
    const filteredProducts = products.filter(p =>
        (!filterCategory || p.category === filterCategory) &&
        (!filterType || p.type === filterType) &&
        (!filterCondition || p.condition === filterCondition) &&
        (!filterStatus || p.status === filterStatus) &&
        (!filterRAM || p.ram === filterRAM) &&
        (!filterStorageType || p.storageType === filterStorageType) &&
        (!filterStorageCapacity || p.storageCapacity === filterStorageCapacity) &&
        (!searchName || p.name.toLowerCase().includes(searchName.toLowerCase()))
    );

    const clearFilters = () => {
        setFilterCategory('');
        setFilterType('');
        setFilterCondition('');
        setFilterStatus('');
        setFilterRAM('');
        setFilterStorageType('');
        setFilterStorageCapacity('');
        setSearchName('');
    };

    const handleEditProduct = async (product: ProductsTableDto) => {
        try {
            console.log("Entrando a handleEditProduct");
            setLoading(true);

            // Llamar al endpoint que verifica transacciones pendientes
            const res = await api.get<{ havePendingTransactions: boolean }>(
                `/products/verify-pending-transactions/${product.id}`
            );
            console.log("Respuesta de verificacion de transacciones pendientes:", res.data);
            if (res.data.havePendingTransactions) {
                await Swal.fire({
                    icon: "warning",
                    title: "No se puede editar",
                    text: "Actualmente este producto tiene transacciones pendientes. Por favor primero termínelas o cancélalas.",
                });
                return;
            }

            // Si no hay transacciones pendientes, redirigir al edit
            router.push(`/edit/${product.id}`);

        } catch (error: any) {
            console.error("Ocurrio un error al editar el producto:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || error.message || "Algo salió mal.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditStock = async (product: ProductsTableDto) => {
        try {
            setLoading(true);

            // Primero preguntar qué acción quiere realizar
            const { value: action } = await Swal.fire({
                title: "Editar cantidad",
                text: "Elige una opción:",
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: "Agregar cantidad",
                denyButtonText: "Modificar cantidad",
                cancelButtonText: "Cancelar",
            });

            if (!action) return; // Canceló

            // ---------------- AGREGAR CANTIDAD ----------------
            if (action === true) {
                const { value: addAmount } = await Swal.fire({
                    title: "Agregar cantidad",
                    input: "number",
                    inputLabel: "Ingresa la cantidad a agregar",
                    inputAttributes: { min: "1", step: "1" },
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) return "Debes ingresar un valor";
                        if (Number(value) <= 0) return "La cantidad debe ser mayor que 0";
                        return null;
                    },
                });

                if (!addAmount) return;

                // Agregar cantidad
                await api.patch(`/products/update-stock/${product.id}`, {
                    stock: product.stock + Number(addAmount),
                });
                await Swal.fire({
                    icon: "success",
                    title: "Cantidad agregada",
                    text: `Se agregaron ${addAmount} unidades al producto.`,
                    timer: 1000,
                    timerProgressBar: true,
                });
                setTimeout(() => window.location.reload(), 1000);

                return;
            }

            // ---------------- MODIFICAR CANTIDAD ----------------
            if (action === false) {
                const { value: newStock } = await Swal.fire({
                    title: "Modificar cantidad",
                    input: "number",
                    inputLabel: `Ingresa la nueva cantidad (mínimo reservado: ${product.reservedQuantity})`,
                    inputAttributes: { min: product.reservedQuantity.toString(), step: "1" },
                    showCancelButton: true,
                    inputValidator: async (value) => {
                        if (!value) return "Debes ingresar un valor";

                        const numValue = Number(value);

                        if (numValue < product.reservedQuantity) {
                            // Verificar si hay transacciones pendientes
                            const res = await api.get<{ havePendingTransactions: boolean }>(
                                `/products/verify-pending-transactions/${product.id}`
                            );

                            if (res.data.havePendingTransactions) {
                                return "No puedes reducir el stock por debajo de la cantidad reservada mientras existan transacciones pendientes. Por favor, termínalas o cancélalas.";
                            } else {
                                return `La nueva cantidad no puede ser menor que la cantidad reservada (${product.reservedQuantity}).`;
                            }
                        }

                        return null;
                    },
                });

                if (!newStock) return;

                // Llamada al endpoint para actualizar stock
                await api.patch(`/products/update-stock/${product.id}`, { stock: Number(newStock) });

                await Swal.fire({
                    icon: "success",
                    title: "Stock modificado",
                    text: `El stock ahora es ${newStock} unidades.`,
                    timer: 1000,
                    timerProgressBar: true,
                });

                setTimeout(() => window.location.reload(), 1000);

                return;
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || error.message || "Algo salió mal.",
            });
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="p-6 w-full max-w-6xl mx-auto">
            <div className="flex flex-col items-center mb-8 gap-6">
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">
                    Gestionar Mis Productos
                </h1>

                {/* Barra de búsqueda */}
                <div className="w-full max-w-md">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-black/70 border border-white text-white placeholder-gray-400 
              focus:outline-none focus:ring-4 focus:ring-white focus:border-white focus:shadow-lg transition-all"
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap justify-center gap-2 w-full max-w-5xl">
                    <SelectFilter value={filterCategory} onChange={setFilterCategory} options={ProductCategory} label="Todas las categorías" />
                    <SelectFilter value={filterType} onChange={setFilterType} options={ProductType} label="Todos los tipos" labelsMap={productTypeLabels} />
                    <SelectFilter value={filterCondition} onChange={setFilterCondition} options={ProductCondition} label="Todas las condiciones" labelsMap={productConditionLabels} />
                    <SelectFilter value={filterStatus} onChange={setFilterStatus} options={ProductStatus} label="Todos los estados" labelsMap={productStatusLabels} />
                    <SelectFilter value={filterRAM} onChange={setFilterRAM} options={RAMSize} label="Todas las RAM" />
                    <SelectFilter value={filterStorageType} onChange={setFilterStorageType} options={StorageType} label="Todos los tipos de almacenamiento" />
                    <SelectFilter value={filterStorageCapacity} onChange={setFilterStorageCapacity} options={StorageCapacity} label="Todas las capacidades" />

                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 rounded border border-gray-700 text-white font-semibold bg-gray-800 transition-all duration-300 hover:bg-gray-600 hover:text-white hover:text-lg"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* Conteo */}
            <p className="mb-4 text-text-primary-light dark:text-text-primary-dark text-center">
                Productos que coinciden: {filteredProducts.length}
            </p>

            <div className="w-full max-w-screen overflow-x-auto bg-black/80 rounded shadow p-4 border border-white hover:shadow-[0_0_15px_white] transition-all">
                <table className="table-auto min-w-max">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark">
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
                                "Modelo",
                                "RAM",
                                "Tipo de Almacenamiento",
                                "Capacidad de Almacenamiento",
                                "Sistema Operativo",
                                "Procesador",
                                "Tarjeta gráfica",
                                "Razón de rechazo",
                                "Fecha de creación",
                                "Fecha de última actualización",
                                "Acciones",
                            ].map((header, i, arr) => (
                                <th
                                    key={header}
                                    className={`py-2 px-4 text-center text-text-primary-light dark:text-text-primary-dark ${i !== arr.length - 1 ? 'border-r border-border-light dark:border-border-dark' : ''
                                        }`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const statusGlow = product.status === 'Pending' ? 'yellow' : product.status === 'Approved' ? 'green' : 'red';
                            const isPending = product.status === 'Pending';
                            const actionText = isPending ? 'Ver y Evaluar' : 'Ver';
                            const actionColor = isPending ? 'text-yellow-400' : product.status === 'Approved' ? 'text-green-500' : 'text-red-500';

                            return (
                                <tr
                                    key={product.id}
                                    className="border-b border-border-light dark:border-border-dark transition-all duration-300 transform cursor-pointer"
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = `0 0 15px ${statusGlow}`;
                                        el.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = '';
                                        el.style.transform = '';
                                    }}
                                >
                                    <td className="py-2 px-4 border-r text-center">{product.name}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.brand}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.category}</td>
                                    <td className="py-2 px-4 border-r text-center">{productTypeLabels[product.type]}</td>
                                    <td className="py-2 px-4 border-r text-center">{productConditionLabels[product.condition]}</td>
                                    <td className="py-2 px-4 border-r text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${product.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900'
                                                : product.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                                                }`}
                                        >
                                            {productStatusLabels[product.status]}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-r text-center">
                                        {product.type === 'Donation'
                                            ? 'Donación'
                                            : product.price != null
                                                ? `$${product.price}`
                                                : 'Sin precio'}
                                    </td>
                                    <td className="py-2 px-4 border-r text-center">{product.stock}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.availableQuantity}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.reservedQuantity}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.owner}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.model}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.ram}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.storageType}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.storageCapacity}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.operatingSystem}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.processor}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.graphicsCard ?? "No tiene"}</td>
                                    <td className="py-2 px-4 border-r text-center">{product.rejectionReason ?? "Este producto no ha sido rechazado"}</td>
                                    <td className="py-2 px-4 border-r text-center">{new Date(product.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-r text-center">{new Date(product.updatedAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 flex justify-center gap-4">
                                        {product.status == ProductStatus.REJECTED && (
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                disabled={loading}
                                                className={`text-red-500 font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline ${loading ? "opacity-50 cursor-not-allowed hover:scale-100 hover:underline-none" : ""
                                                    }`}
                                            >
                                                Editar
                                            </button>
                                        )}

                                        {product.status == ProductStatus.PENDING && (
                                            <Link
                                                href={`/buy/${product.id}`}
                                                className={`text-blue-500 font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline ${loading ? "opacity-50 pointer-events-none" : ""
                                                    }`}
                                            >
                                                Ver producto
                                            </Link>
                                        )}

                                        {product.status == ProductStatus.APPROVED && (
                                            <>
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    disabled={loading}
                                                    className={`text-red-500 font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline ${loading ? "opacity-50 cursor-not-allowed hover:scale-100 hover:underline-none" : ""
                                                        }`}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleEditStock(product)}
                                                    className={`text-yellow-500 font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline ${loading ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                >
                                                    Editar cantidad
                                                </button>

                                                <Link
                                                    href={`/buy/${product.id}`}
                                                    className={`text-blue-500 font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline ${loading ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                >
                                                    Ver producto
                                                </Link>
                                            </>
                                        )}
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>

        </div >
    );
}

// Componente reutilizable para selects de filtro
export function SelectFilter({ value, onChange, options, label, labelsMap }: { value: string; onChange: (v: string) => void; options: any; label: string; labelsMap?: Record<string, string> }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
            <option value="">{label}</option>
            {Object.values(options).map((opt) => (
                <option key={String(opt)} value={String(opt)}>
                    {labelsMap ? labelsMap[opt as string] : String(opt)}
                </option>
            ))}
        </select>
    );
}

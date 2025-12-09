'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { ProductsTableDto } from '@/types/products-table.dto';
import { ProductCategory, ProductCondition, ProductStatus, ProductType, RAMSize, StorageCapacity, StorageType } from '@/types/product-details.dto';
import { productTypeLabels, productConditionLabels, productStatusLabels } from '@/constants/productLabels';

export default function AdminProducts() {
    const [products, setProducts] = useState<ProductsTableDto[]>([]);
    const [loading, setLoading] = useState(true);

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
                const res = await api.get<ProductsTableDto[]>('/products/table');
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

    return (
        <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-8 gap-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">
                    Gestionar Productos
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
                    <SelectFilter value={filterCategory} onChange={setFilterCategory} options={ProductCategory} label="Categorías" />
                    <SelectFilter value={filterType} onChange={setFilterType} options={ProductType} label="Tipos" labelsMap={productTypeLabels} />
                    <SelectFilter value={filterCondition} onChange={setFilterCondition} options={ProductCondition} label="Condiciones" labelsMap={productConditionLabels} />
                    <SelectFilter value={filterStatus} onChange={setFilterStatus} options={ProductStatus} label="Estados" labelsMap={productStatusLabels} />
                    <SelectFilter value={filterRAM} onChange={setFilterRAM} options={RAMSize} label="RAM" />
                    <SelectFilter value={filterStorageType} onChange={setFilterStorageType} options={StorageType} label="Almacenamiento" />
                    <SelectFilter value={filterStorageCapacity} onChange={setFilterStorageCapacity} options={StorageCapacity} label="Capacidad" />

                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 rounded border border-gray-700 text-white font-semibold bg-gray-800 transition-all duration-300 hover:bg-gray-600 hover:text-white"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* Conteo */}
            <p className="mb-4 text-text-primary-light dark:text-text-primary-dark text-center">
                Productos que coinciden: {filteredProducts.length}
            </p>

            {/* Vista de Tabla para Escritorio */}
            <div className="hidden md:block w-full overflow-x-auto bg-black/80 rounded shadow p-4 border border-white hover:shadow-[0_0_15px_white] transition-all">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark">
                            {[
                                "Nombre", "Marca", "Categoría", "Tipo", "Condición", "Estado", "Precio", "Stock", "Propietario", "Acciones"
                            ].map((header, i) => (
                                <th key={i} className="py-3 px-4 text-center text-text-primary-light dark:text-text-primary-dark border-r border-border-light dark:border-border-dark last:border-r-0">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <ProductRow key={product.id} product={product} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista de Tarjetas para Móvil */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

// Componente para Fila de Producto (usado en tabla)
function ProductRow({ product }: { product: ProductsTableDto }) {
    const statusGlow = product.status === 'Pending' ? 'yellow' : product.status === 'Approved' ? 'green' : 'red';
    const isPending = product.status === 'Pending';
    const actionText = isPending ? 'Ver y Evaluar' : 'Ver';
    const actionColor = isPending ? 'text-yellow-400' : product.status === 'Approved' ? 'text-green-500' : 'text-red-500';

    return (
        <tr
            className="border-b border-border-light dark:border-border-dark transition-all duration-300 transform cursor-pointer"
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 15px ${statusGlow}`;
                e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.transform = '';
            }}
        >
            <td className="py-2 px-4 border-r text-center">{product.name}</td>
            <td className="py-2 px-4 border-r text-center">{product.brand}</td>
            <td className="py-2 px-4 border-r text-center">{product.category}</td>
            <td className="py-2 px-4 border-r text-center">{productTypeLabels[product.type]}</td>
            <td className="py-2 px-4 border-r text-center">{productConditionLabels[product.condition]}</td>
            <td className="py-2 px-4 border-r text-center">
                <StatusLabel status={product.status} />
            </td>
            <td className="py-2 px-4 border-r text-center">
                {product.type === 'Donation' ? 'Donación' : product.price != null ? `$${product.price}` : 'N/A'}
            </td>
            <td className="py-2 px-4 border-r text-center">{product.stock}</td>
            <td className="py-2 px-4 border-r text-center">{product.owner}</td>
            <td className="py-2 px-4 flex justify-center gap-4">
                <Link
                    href={`/admin/products/view/${product.id}?status=${product.status}`}
                    className={`${actionColor} font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline`}
                    style={{ textShadow: '0 0 0 transparent' }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.textShadow = `0 0 8px ${getComputedStyle(el).color}`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.textShadow = '0 0 0 transparent';
                    }}
                >
                    {actionText}
                </Link>
            </td>
        </tr>
    );
}

// Componente para Tarjeta de Producto (usado en móvil)
function ProductCard({ product }: { product: ProductsTableDto }) {
    const isPending = product.status === 'Pending';
    const actionText = isPending ? 'Ver y Evaluar' : 'Ver';
    const actionColor = isPending ? 'text-yellow-400' : product.status === 'Approved' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-black/80 border border-white rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-sm text-gray-300">{product.brand}</p>
                <div className="my-2">
                    <StatusLabel status={product.status} />
                </div>
                <div className="text-sm text-gray-400 mt-2">
                    <p><strong>Categoría:</strong> {product.category}</p>
                    <p><strong>Tipo:</strong> {productTypeLabels[product.type]}</p>
                    <p><strong>Precio:</strong> {product.type === 'Donation' ? 'Donación' : product.price != null ? `$${product.price}` : 'N/A'}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Propietario:</strong> {product.owner}</p>
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <Link
                    href={`/admin/products/view/${product.id}?status=${product.status}`}
                    className={`${actionColor} font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:underline`}
                >
                    {actionText}
                </Link>
            </div>
        </div>
    );
}

// Componente para Etiqueta de Estado
function StatusLabel({ status }: { status: ProductStatus }) {
    const statusClasses = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900',
        Approved: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
        Rejected: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>
            {productStatusLabels[status]}
        </span>
    );
}

// Componente reutilizable para selects de filtro
export function SelectFilter({ value, onChange, options, label, labelsMap }: { value: string; onChange: (v: string) => void; options: any; label: string; labelsMap?: Record<string, string> }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="px-4 py-2 rounded bg-black/80 border border-white text-white text-sm"
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

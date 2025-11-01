'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { glowColors } from '@/constants/glowColors';
import api from '@/utils/api';
import {
    ProductsTableDto,
    ProductCategory,
    ProductType,
    ProductCondition,
    ProductStatus,
    RAMSize,
    StorageType,
    StorageCapacity,
} from '@/types/products-table.dto';

export default function AdminProductsPage() {
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
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col items-center mb-8 gap-6">
                {/* Título */}
                <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">
                    Manage Products & Proposals
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
                    <SelectFilter value={filterCategory} onChange={setFilterCategory} options={ProductCategory} label="All Categories" />
                    <SelectFilter value={filterType} onChange={setFilterType} options={ProductType} label="All Types" />
                    <SelectFilter value={filterCondition} onChange={setFilterCondition} options={ProductCondition} label="All Conditions" />
                    <SelectFilter value={filterStatus} onChange={setFilterStatus} options={ProductStatus} label="All Status" />
                    <SelectFilter value={filterRAM} onChange={setFilterRAM} options={RAMSize} label="All RAM" />
                    <SelectFilter value={filterStorageType} onChange={setFilterStorageType} options={StorageType} label="All Storage Types" />
                    <SelectFilter value={filterStorageCapacity} onChange={setFilterStorageCapacity} options={StorageCapacity} label="All Storage Capacities" />

                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 rounded border border-white text-white font-semibold transition-all duration-300 hover:bg-gray-200 hover:text-black hover:text-lg"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* Conteo */}
            <p className="mb-4 text-text-primary-light dark:text-text-primary-dark text-center">
                Productos que coinciden: {filteredProducts.length}
            </p>

            {/* Tabla */}
            <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300 overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark">
                            {['Name', 'Brand', 'Model', 'Category', 'Type', 'Condition', 'Status', 'Price', 'Quantity', 'RAM', 'Storage', 'Owner', 'Created At', 'Actions'].map((header, i, arr) => (
                                <th
                                    key={header}
                                    className={`py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark ${i !== arr.length - 1 ? 'border-r border-border-light dark:border-border-dark' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => {
                            const statusGlow = product.status === 'Pending' ? 'yellow' : product.status === 'Approved' ? 'green' : 'red';
                            const isPending = product.status === 'Pending';
                            const actionText = isPending ? 'View & Evaluate' : 'View';
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
                                    <td className="py-2 px-4 border-r">{product.name}</td>
                                    <td className="py-2 px-4 border-r">{product.brand}</td>
                                    <td className="py-2 px-4 border-r">{product.model}</td>
                                    <td className="py-2 px-4 border-r">{product.category}</td>
                                    <td className="py-2 px-4 border-r">{product.type}</td>
                                    <td className="py-2 px-4 border-r">{product.condition}</td>
                                    <td className="py-2 px-4 border-r">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${product.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900'
                                                : product.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-r">{product.type === 'Donation' ? 'Donation' : `$${product.price}`}</td>
                                    <td className="py-2 px-4 border-r">{product.quantity}</td>
                                    <td className="py-2 px-4 border-r">{product.ram}</td>
                                    <td className="py-2 px-4 border-r">{product.storageType} {product.storageCapacity}</td>
                                    <td className="py-2 px-4 border-r">{product.owner}</td>
                                    <td className="py-2 px-4 border-r">{new Date(product.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 flex gap-4">
                                        <Link
                                            href={`/admin/products/view/${product.id}?status=${product.status}`}
                                            className={`
            ${actionColor} font-semibold text-lg transition-all duration-300 transform
            hover:scale-110 hover:underline
        `}
                                            style={{
                                                textShadow: '0 0 0 transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                el.style.textShadow = `0 0 8px ${getComputedStyle(el).color}`;
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                el.style.textShadow = '0 0 0 transparent';
                                            }}
                                        >
                                            {actionText}
                                        </Link>
                                    </td>


                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Componente reutilizable para selects de filtro
function SelectFilter({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: any; label: string }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
            <option value="">{label}</option>
            {Object.values(options).map((opt) => (
                <option key={String(opt)} value={String(opt)}>{String(opt)}</option>
            ))}

        </select>
    );
}

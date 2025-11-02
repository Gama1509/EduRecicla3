'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { ProductCardDto } from '@/types/product-card.dto';
import { glowColors } from '@/constants/glowColors';
import Link from 'next/link';
import { ProductCategory, ProductCondition, ProductType } from '@/types/product-details.dto';
export default function BuyPage() {
  const [products, setProducts] = useState<ProductCardDto[]>([]);
  const [filtered, setFiltered] = useState<ProductCardDto[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | ProductType>('All');
  const [conditionFilter, setConditionFilter] = useState<'All' | ProductCondition>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | ProductCategory>('All');
  const [sortPrice, setSortPrice] = useState<'none' | 'asc' | 'desc'>('none');

  // Fetch products approved
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<ProductCardDto[]>('/products/getAllApproved');
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  // Filtrado dinámico
  useEffect(() => {
    let temp = [...products];

    // Filtro por tipo
    if (typeFilter !== 'All') temp = temp.filter(p => p.type === typeFilter);

    // Filtro por condición
    if (conditionFilter !== 'All') temp = temp.filter(p => p.condition === conditionFilter);

    // Filtro por categoría
    if (categoryFilter !== 'All') temp = temp.filter(p => p.category === categoryFilter);

    // Buscador
    if (search.trim() !== '') {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.model.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Ordenar por precio solo si son ventas (Sale)
    if (sortPrice !== 'none') {
      temp.sort((a, b) => {
        const priceA = a.price ?? 0;
        const priceB = b.price ?? 0;

        if (a.type === 'Donation') return 1; // las donaciones al final
        if (b.type === 'Donation') return -1;

        return sortPrice === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    setFiltered(temp);
  }, [products, search, typeFilter, conditionFilter, categoryFilter, sortPrice]);

  const clearFilters = () => {
    setTypeFilter('All');
    setConditionFilter('All');
    setCategoryFilter('All');
    setSortPrice('none');
    setSearch('');
  };

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Título */}
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6 text-center">
        Buy Products
      </h1>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, brand, or model"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-full px-4 py-2 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Filtros y botón */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as 'All' | ProductType)}
          className="flex-1 min-w-[140px] px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">All Types</option>
          {Object.values(ProductType).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={conditionFilter}
          onChange={e => setConditionFilter(e.target.value as 'All' | ProductCondition)}
          className="flex-1 min-w-[140px] px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">All Conditions</option>
          {Object.values(ProductCondition).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as 'All' | ProductCategory)}
          className="flex-1 min-w-[140px] px-4 py-2 rounded bg-black/80 border border-white text-white"
        >
          <option value="All">All Categories</option>
          {Object.values(ProductCategory).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {typeFilter !== 'Donation' && (
          <select
            value={sortPrice}
            onChange={e => setSortPrice(e.target.value as 'none' | 'asc' | 'desc')}
            className="flex-1 min-w-[140px] px-4 py-2 rounded bg-black/80 border border-white text-white"
          >
            <option value="none">Sort by Price</option>
            <option value="asc">Price Low → High</option>
            <option value="desc">Price High → Low</option>
          </select>
        )}

        <button
          onClick={clearFilters}
          className="flex-1 min-w-[140px] px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white font-semibold transition-all duration-300 hover:bg-gray-600 hover:text-white hover:text-lg"
        >
          Clear Filters
        </button>
      </div>


      {/* Productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p, index) => {
          const glowColor = glowColors[index % glowColors.length]; // color dinámico
          return (
            <Link key={p.id} href={`/buy/${p.id}`}>
              <div
                className="border rounded shadow p-4 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                style={{ boxShadow: `0 0 10px ${glowColor}` }}
              >
                <img
                  src={p.imageUrl ?? '/default-product.png'}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.brand} - {p.model}</p>
                <p className="text-sm">{p.category} | {p.condition}</p>
                {p.price && p.type === 'Sale' && <p className="font-bold mt-1">${p.price}</p>}
                <p className="text-sm">{p.processor} | {p.ram} | {p.storageType} {p.storageCapacity}</p>
                {p.graphicsCard && <p className="text-sm">GPU: {p.graphicsCard}</p>}
                {p.screenSize && <p className="text-sm">Screen: {p.screenSize}</p>}
                {p.color && <p className="text-sm">Color: {p.color}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>

  );
}

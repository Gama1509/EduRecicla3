// @/components/products/FilterBar.tsx
"use client";
import { ProductFilters } from "@/services/productService";

const categories = ['All', 'Laptop', 'Tablet', 'Monitor', 'Accessory'];
const conditions = ['All', 'New', 'Used - Like New', 'Used - Good', 'Used - Fair'];
const sortOptions = ['newest', 'price-asc', 'price-desc'];

interface FilterBarProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFilterChange({ ...filters, [name]: checked ? name : 'all' });
  };

  return (
    <aside className="w-full bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Search</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            placeholder="Search for products..."
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border-dark dark:focus:ring-secondary-dark"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label htmlFor="condition" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Condition</label>
          <select
            id="condition"
            name="condition"
            value={filters.condition}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border-dark dark:focus:ring-secondary-dark"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-text-primary-light dark:text-text-primary-dark">
            <input
              type="checkbox"
              name="forSale"
              checked={filters.action === 'forSale'}
              onChange={handleCheckboxChange}
              className="form-checkbox text-secondary dark:text-secondary-dark"
            />
            <span className="ml-2">For Sale</span>
          </label>
          <label className="flex items-center text-text-primary-light dark:text-text-primary-dark">
            <input
              type="checkbox"
              name="forDonation"
              checked={filters.action === 'forDonation'}
              onChange={handleCheckboxChange}
              className="form-checkbox text-primary dark:text-primary-dark"
            />
            <span className="ml-2">For Donation</span>
          </label>
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sort" className="block text-text-secondary-light dark:text-text-secondary-dark font-semibold mb-2">Sort By</label>
          <select
            id="sort"
            name="sort"
            value={filters.sort || 'newest'}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border-dark dark:focus:ring-secondary-dark"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};

export default FilterBar;

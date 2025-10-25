"use client";
import { useState } from 'react';
import { createListing, ListingFormData } from '@/services/listingService';

const categories = ['Laptop', 'Tablet', 'Monitor', 'Accessory'];
const conditions = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

export default function DonatePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data: ListingFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      condition: formData.get('condition') as string,
      isDonation: true,
      price: 0,
      image: formData.get('image') as File,
    };

    try {
      await createListing(data);
      setStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to create listing:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-md transition-colors duration-300">
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        Donate Your Tech
      </h1>

      <form className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-lg transition-colors duration-300" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Refurbished Dell Laptop"
            required
            className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Provide a brief description of the item."
            required
            className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="mb-4">
          <label htmlFor="condition" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="w-full text-text-primary-light dark:text-text-primary-dark"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Donation'}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <p className="mt-4 text-center text-primary dark:text-primary-dark">
            Thank you for your generous donation!
          </p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-center text-red-600">
            Something went wrong. Please try again later.
          </p>
        )}
      </form>
    </div>
  );
}

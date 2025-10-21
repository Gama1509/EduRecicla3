// @/app/donate/page.tsx
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Donate Your Tech</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            placeholder="e.g., Refurbished Dell Laptop"
            required
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            placeholder="Provide a brief description of the item."
            required
          ></textarea>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="mb-4">
          <label htmlFor="condition" className="block text-gray-700 font-semibold mb-2">Condition</label>
          <select
            id="condition"
            name="condition"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-green-DEFAULT text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Donation'}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <p className="mt-4 text-center text-green-600">
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

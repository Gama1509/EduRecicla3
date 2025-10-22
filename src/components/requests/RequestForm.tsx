// @/components/requests/RequestForm.tsx
"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const RequestForm = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const productId = searchParams.get('productId');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary-600">
          {action === 'buy' ? 'Purchase Successful!' : 'Request Submitted!'}
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          {action === 'buy'
            ? 'Thank you for your purchase. Your product is on the way!'
            : 'Your request has been sent to the administrator for approval.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {action === 'buy' ? 'Confirm Your Purchase' : 'Request This Donation'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <input type="hidden" name="productId" value={productId || ''} />
        <input type="hidden" name="action" value={action || ''} />

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">Shipping Address</label>
          <textarea
            id="address"
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-DEFAULT"
            placeholder="123 Main St, Anytown, USA"
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox text-secondary" />
            <span className="ml-2 text-gray-600">Save this information for next time</span>
          </label>
        </div>

        <button
          type="submit"
          className={`w-full font-bold py-3 px-6 rounded-lg text-white transition-colors ${
            action === 'buy'
              ? 'bg-secondary hover:bg-secondary-600'
              : 'bg-primary hover:bg-primary-600'
          }`}
        >
          {action === 'buy' ? 'Complete Purchase' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;

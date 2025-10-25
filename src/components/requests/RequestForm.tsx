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
        <h2 className="text-3xl font-bold text-primary dark:text-primary-dark">
          {action === 'buy' ? 'Purchase Successful!' : 'Request Submitted!'}
        </h2>
        <p className="mt-4 text-lg text-text-secondary-light dark:text-text-secondary-dark">
          {action === 'buy'
            ? 'Thank you for your purchase. Your product is on the way!'
            : 'Your request has been sent to the administrator for approval.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-background-light dark:bg-background-dark p-8 rounded-lg shadow-md transition-colors duration-300">
      <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        {action === 'buy' ? 'Confirm Your Purchase' : 'Request This Donation'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-lg transition-colors duration-300">
        <input type="hidden" name="productId" value={productId || ''} />
        <input type="hidden" name="action" value={action || ''} />

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">
            Shipping Address
          </label>
          <textarea
            id="address"
            rows={3}
            className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-dark"
            placeholder="123 Main St, Anytown, USA"
            required
          ></textarea>
        </div>

        {/* Save Info Checkbox */}
        <div className="mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox text-secondary dark:text-secondary-dark bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark" />
            <span className="ml-2 text-text-secondary-light dark:text-text-secondary-dark">
              Save this information for next time
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full font-bold py-3 px-6 rounded-lg text-white transition-colors duration-200 ${
            action === 'buy'
              ? 'bg-secondary hover:bg-secondary-hover dark:bg-secondary-dark dark:hover:bg-secondary-dark-hover'
              : 'bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover'
          }`}
        >
          {action === 'buy' ? 'Complete Purchase' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestForm;

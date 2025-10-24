// @/components/profile/TransactionPanel.tsx
const transactions = [
  { id: 1, type: 'Sold', item: 'Refurbished Dell Laptop', date: '2023-10-15', amount: 250 },
  { id: 2, type: 'Bought', item: 'Samsung Galaxy Tablet', date: '2023-10-12', amount: -150 },
  { id: 3, type: 'Donated', item: 'HP 24-inch Monitor', date: '2023-10-10', amount: 0 },
];

const TransactionPanel = () => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-text-primary-light dark:text-text-primary-dark">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Item</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'Sold' ? 'bg-primary/20 text-primary dark:bg-primary-dark/20 dark:text-primary-dark' :
                      transaction.type === 'Bought' ? 'bg-secondary/20 text-secondary dark:bg-secondary-dark/20 dark:text-secondary-dark' :
                      'bg-secondary/20 text-secondary dark:bg-secondary-dark/20 dark:text-secondary-dark'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-2 px-4">{transaction.item}</td>
                <td className="py-2 px-4">{transaction.date}</td>
                <td className={`py-2 px-4 text-right font-semibold ${
                  transaction.amount > 0 ? 'text-primary dark:text-primary-dark' :
                  transaction.amount < 0 ? 'text-red-600' :
                  'text-text-secondary-light dark:text-text-secondary-dark'
                }`}>
                  {transaction.amount === 0 ? '-' : `$${Math.abs(transaction.amount)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPanel;

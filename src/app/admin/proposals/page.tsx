// @/app/admin/proposals/page.tsx
import { proposals } from '@/data/proposals';

export default function AdminProposalsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        Manage Proposals
      </h1>

      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6 rounded-lg shadow-md transition-colors duration-300">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">User</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Product</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Type</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Status</th>
              <th className="py-2 px-4 text-left text-text-primary-light dark:text-text-primary-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr
                key={proposal.id}
                className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">{proposal.userName}</td>
                <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">{proposal.productName}</td>
                <td className="py-2 px-4 text-text-primary-light dark:text-text-primary-dark">{proposal.type}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${proposal.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900'
                      : proposal.status === 'Approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                        : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                      }`}

                  >
                    {proposal.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {proposal.status === 'Pending' && (
                    <>
                      <button className="text-green-600 dark:text-green-400 hover:underline">Approve</button>
                      <button className="ml-4 text-red-600 hover:underline">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

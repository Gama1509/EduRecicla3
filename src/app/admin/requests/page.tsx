// @/app/admin/requests/page.tsx
import { requests } from '@/data/requests';

export default function AdminRequestsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Donation Requests</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{request.userName}</td>
                <td className="py-2 px-4">{request.productName}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Approved' ? 'bg-primary-100 text-primary-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {request.status === 'Pending' && (
                    <>
                      <button className="text-primary-600 hover:underline">Approve</button>
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

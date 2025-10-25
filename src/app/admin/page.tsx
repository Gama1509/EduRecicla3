export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Card 1 */}
  <div className="border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 h-full flex flex-col p-6">
    <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
      Total Products
    </h2>
    <p className="text-3xl font-bold mt-2 text-text-primary-light dark:text-text-primary-dark">
      12
    </p>
    <span className="mt-4 px-3 py-1 rounded-lg text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark w-max">
      Stats
    </span>
  </div>

  {/* Card 2 */}
  <div className="border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 h-full flex flex-col p-6">
    <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
      Pending Proposals
    </h2>
    <p className="text-3xl font-bold mt-2 text-text-primary-light dark:text-text-primary-dark">
      5
    </p>
    <span className="mt-4 px-3 py-1 rounded-lg text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark w-max">
      Stats
    </span>
  </div>

  {/* Card 3 */}
  <div className="border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 h-full flex flex-col p-6">
    <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
      Open Requests
    </h2>
    <p className="text-3xl font-bold mt-2 text-text-primary-light dark:text-text-primary-dark">
      3
    </p>
    <span className="mt-4 px-3 py-1 rounded-lg text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark w-max">
      Stats
    </span>
  </div>
</div>

    </div>
  );
}

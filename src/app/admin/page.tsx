"use client";
import { glowColors } from "@/constants/glowColors";

export default function AdminDashboardPage() {
  const cardGlow = glowColors[1]; // Puedes elegir el color que quieras

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8 text-center">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div
          className="border rounded-lg shadow-lg bg-card-light dark:bg-card-dark p-6 flex flex-col items-start transition-transform transform hover:-translate-y-2 hover:shadow-[0_0_20px_var(--glow-color)] h-full"
          style={{ "--glow-color": cardGlow } as any}
        >
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Total Products
          </h2>
          <p className="text-3xl font-bold mt-4 text-text-primary-light dark:text-text-primary-dark">
            12
          </p>
          <span className="mt-6 px-3 py-1 rounded-full text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark">
            Stats
          </span>
        </div>

        {/* Card 2 */}
        <div
          className="border rounded-lg shadow-lg bg-card-light dark:bg-card-dark p-6 flex flex-col items-start transition-transform transform hover:-translate-y-2 hover:shadow-[0_0_20px_var(--glow-color)] h-full"
          style={{ "--glow-color": cardGlow } as any}
        >
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Pending Proposals
          </h2>
          <p className="text-3xl font-bold mt-4 text-text-primary-light dark:text-text-primary-dark">
            5
          </p>
          <span className="mt-6 px-3 py-1 rounded-full text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark">
            Stats
          </span>
        </div>

        {/* Card 3 */}
        <div
          className="border rounded-lg shadow-lg bg-card-light dark:bg-card-dark p-6 flex flex-col items-start transition-transform transform hover:-translate-y-2 hover:shadow-[0_0_20px_var(--glow-color)] h-full"
          style={{ "--glow-color": cardGlow } as any}
        >
          <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Open Requests
          </h2>
          <p className="text-3xl font-bold mt-4 text-text-primary-light dark:text-text-primary-dark">
            3
          </p>
          <span className="mt-6 px-3 py-1 rounded-full text-white text-sm font-semibold bg-secondary dark:bg-secondary-dark">
            Stats
          </span>
        </div>
      </div>
    </div>
  );
}

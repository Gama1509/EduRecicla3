// @/app/profile/page.tsx
import UserProfileCard from '@/components/profile/UserProfileCard';
import TransactionPanel from '@/components/profile/TransactionPanel';

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">User Profile</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfileCard />
        </div>
        <div className="lg:col-span-2">
          <TransactionPanel />
        </div>
      </div>
    </div>
  );
}

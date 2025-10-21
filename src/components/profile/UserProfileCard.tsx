// @/components/profile/UserProfileCard.tsx
import Image from 'next/image';

const UserProfileCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <Image
        src="https://picsum.photos/150"
        alt="User Profile"
        width={150}
        height={150}
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h2 className="text-2xl font-semibold mt-4">John Doe</h2>
      <p className="text-gray-600">john.doe@example.com</p>
      <button className="mt-6 bg-blue-DEFAULT text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfileCard;

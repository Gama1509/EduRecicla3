// @/components/profile/UserProfileCard.tsx
import Image from 'next/image';

const UserProfileCard = () => {
  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md text-center">
      <Image
        src="https://picsum.photos/150"
        alt="User Profile"
        width={150}
        height={150}
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h2 className="text-2xl font-semibold mt-4 text-text-primary-light dark:text-text-primary-dark">John Doe</h2>
      <p className="text-text-secondary-light dark:text-text-secondary-dark">john.doe@example.com</p>
      <button className="mt-6 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-hover transition-colors dark:bg-secondary-dark dark:hover:bg-secondary-dark-hover">
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfileCard;

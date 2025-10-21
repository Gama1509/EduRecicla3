// @/services/userService.ts
import { User } from '@/types/user';

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImageUrl: 'https://via.placeholder.com/150',
};

export const getUser = (): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 500); // Simulate network delay
  });
};

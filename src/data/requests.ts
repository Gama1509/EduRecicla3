// @/data/requests.ts
export interface DonationRequest {
  id: number;
  userName: string;
  productName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const requests: DonationRequest[] = [
  { id: 1, userName: 'Student A', productName: 'HP 24-inch Monitor', status: 'Pending' },
  { id: 2, userName: 'Student B', productName: 'Refurbished Dell Laptop', status: 'Approved' },
  { id: 3, userName: 'Student C', productName: 'Samsung Galaxy Tablet', status: 'Rejected' },
];

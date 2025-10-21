// @/data/proposals.ts
export interface Proposal {
  id: number;
  userName: string;
  productName: string;
  type: 'Sale' | 'Donation';
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const proposals: Proposal[] = [
  { id: 1, userName: 'Jane Smith', productName: 'Old Gaming PC', type: 'Sale', status: 'Pending' },
  { id: 2, userName: 'Mike Johnson', productName: 'Acer Laptop', type: 'Donation', status: 'Pending' },
  { id: 3, userName: 'Emily Davis', productName: 'Wireless Keyboard', type: 'Donation', status: 'Approved' },
];

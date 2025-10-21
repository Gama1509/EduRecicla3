// @/services/listingService.ts
export interface ListingFormData {
  name: string;
  description: string;
  category: string;
  condition: string;
  isDonation: boolean;
  price?: number;
  image?: File;
}

export const createListing = (formData: ListingFormData): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Submitting listing:', formData);
      resolve({ success: true });
    }, 1000); // Simulate network delay
  });
};

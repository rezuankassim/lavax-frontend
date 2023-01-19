type Product = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  photoUrl?: string;
  price?: number;
  pivot?: {
    quantity: number;
  };
  created_at: string;
  updated_at: string;
};

export type { Product };

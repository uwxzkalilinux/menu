export interface Category {
  id: string;
  name: string;
  name_ar: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  categories?: Category;
}

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
}

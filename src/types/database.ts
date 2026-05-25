export type Question = {
  id: string;
  content: string;
  likes: number;
  created_at: string;
};

export type Answer = {
  id: string;
  question_id: string;
  content: string;
  created_at: string;
};

export type Spot = {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  avg_rating: number;
  review_count: number;
  created_at: string;
};

export type Review = {
  id: string;
  spot_id: string;
  anon_id: string;
  rating: number;
  content?: string | null;
  created_at: string;
};

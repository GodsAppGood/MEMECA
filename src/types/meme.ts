export interface Meme {
  id: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  blockchain?: string | null;
  trade_link?: string | null;
  twitter_link?: string | null;
  telegram_link?: string | null;
  likes: number;
  created_by?: string | null;
  created_at?: string | null;
  time_until_listing?: string | null;
  is_featured?: boolean | null;
  tuzemoon_until?: string | null;
}

export type MemeWithStringId = Omit<Meme, 'id'> & {
  id: string;
  isPlaceholder?: boolean;
};
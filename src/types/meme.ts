export interface Meme {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  blockchain?: string;
  trade_link?: string;
  twitter_link?: string;
  telegram_link?: string;
  likes: number;
  created_by?: string;
  created_at?: string;
  time_until_listing?: string;
}
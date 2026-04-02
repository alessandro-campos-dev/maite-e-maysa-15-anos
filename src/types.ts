export interface AppConfig {
  welcome_text: string;
  event_date: string;
  whatsapp_link: string;
  location_name: string;
  location_address: string;
  location_map_link: string;
  dress_code_men: string;
  dress_code_women: string;
  gift_clothing_size: string;
  gift_shoe_size: string;
  gift_perfume: string;
  gift_makeup: string;
  gift_stationery: string;
  gift_cosmetics: string;
  splash_image: string;
  hollywood_bg: string;
  video_url: string;
}

export interface Message {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  caption: string;
}

export interface MusicSuggestion {
  id: number;
  song_name: string;
  artist: string;
  suggested_by: string;
  approved: number;
}

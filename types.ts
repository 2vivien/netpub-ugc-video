export enum PortfolioCategory {
  PHOTO_UGC = 'Photo UGC',
  PHOTO_MODE = 'Photo Mode',
  PHOTO_SPOT_PUBLICITAIRE = 'Photo Spot Publicitaire',
  VIDEO_UGC = 'Vidéo UGC',
  VIDEO_MODE = 'Vidéo Mode',
  VIDEO_SPOT_PUBLICITAIRE = 'Spot Publicitaire 4K',
  STRATEGY = 'Stratégie',
}

export interface Comment {
  author: string;
  text: string;
  avatar: string;
  timestamp: string;
  replies?: Comment[];
}

export interface PortfolioProject {
  id: number;
  title: string;
  category: PortfolioCategory;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  videoUrl?: string;
  likes?: number;
  comments?: Comment[];
  hashtags?: string[];
  // Optional fields, depending on usage
  client?: string;
  objective?: string;
  role?: string;
  thumbnailUrl?: string; // Still useful for video previews
}

export interface ChatMessage {
    id: number;
    role: 'user' | 'model';
    text: string;
    type?: 'text' | 'function_confirmation';
}
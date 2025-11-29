export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  isCurrentUser?: boolean;
}

export interface WishlistItem {
  id: string;
  userId: string;
  title: string;
  price?: number;
  currency?: string;
  url: string;
  imageUrl?: string;
  description?: string;
  isPrivate: boolean;
  createdAt: number;
}

export type ViewState = 
  | { type: 'feed' }
  | { type: 'friends' }
  | { type: 'profile'; userId: string } // Can be current user or friend
  | { type: 'settings' };

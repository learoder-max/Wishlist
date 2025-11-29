import { User, WishlistItem } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    bio: 'Tech enthusiast & Coffee lover',
    isCurrentUser: true,
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    bio: 'Minimalist design fan',
  },
  {
    id: 'u3',
    name: 'Jordan Smith',
    avatar: 'https://picsum.photos/seed/jordan/200/200',
    bio: 'Outdoor adventurer',
  },
  {
    id: 'u4',
    name: 'Emily Davis',
    avatar: 'https://picsum.photos/seed/emily/200/200',
    bio: 'Bookworm & Baker',
  },
];

export const MOCK_ITEMS: WishlistItem[] = [
  {
    id: 'i1',
    userId: 'u1',
    title: 'Sony WH-1000XM5 Headphones',
    price: 348.00,
    currency: '$',
    url: 'https://electronics.example.com/sony-xm5',
    imageUrl: 'https://picsum.photos/seed/sony/400/400',
    description: 'Noise cancelling is a must for work.',
    isPrivate: false,
    createdAt: Date.now() - 10000000,
  },
  {
    id: 'i2',
    userId: 'u1',
    title: 'Secret Gift for Mom',
    price: 150.00,
    currency: '$',
    url: 'https://jewelry.example.com/necklace',
    imageUrl: 'https://picsum.photos/seed/jewelry/400/400',
    isPrivate: true,
    createdAt: Date.now() - 5000000,
  },
  {
    id: 'i3',
    userId: 'u2',
    title: 'Aeron Chair',
    price: 1200.00,
    currency: '$',
    url: 'https://furniture.example.com/aeron',
    imageUrl: 'https://picsum.photos/seed/chair/400/400',
    description: 'My back needs this.',
    isPrivate: false,
    createdAt: Date.now() - 2000000,
  },
  {
    id: 'i4',
    userId: 'u3',
    title: 'Camping Tent 4-Person',
    price: 299.99,
    currency: '$',
    url: 'https://outdoors.example.com/tent',
    imageUrl: 'https://picsum.photos/seed/tent/400/400',
    isPrivate: false,
    createdAt: Date.now() - 86400000,
  },
];

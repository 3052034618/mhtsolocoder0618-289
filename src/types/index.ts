export interface User {
  id: string;
  email: string;
  phone: string;
  nickname: string;
  avatar: string;
  bio: string;
  realName?: string;
  idCard?: string;
  isVerified: boolean;
  verifyStatus: 'pending' | 'approved' | 'rejected' | 'none';
  addressVerified: boolean;
  addressVerifyStatus: 'pending' | 'approved' | 'rejected' | 'none';
  addressProof?: string;
  creditScore: number;
  points: number;
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  location?: string;
  occupation?: string;
  languages: string[];
  hostingCount: number;
  travelCount: number;
  responseRate?: number;
  noShowCount?: number;
}

export interface ListingPhoto {
  id: string;
  listingId: string;
  url: string;
  isCover: boolean;
  order: number;
}

export interface DateRange {
  id: string;
  startDate: string;
  endDate: string;
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  city: string;
  address: string;
  district?: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  beds: number;
  amenities: string[];
  houseRules: string[];
  photos: ListingPhoto[];
  coverPhoto?: string;
  status: 'pending' | 'active' | 'rejected' | 'offline';
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  price?: number;
  isFree: boolean;
  highlights?: string[];
  availableDates: DateRange[];
}

export interface AvailableDate {
  id: string;
  listingId: string;
  date: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed' | 'no_show';
  createdAt: string;
  updatedAt: string;
  guestReviewSubmitted: boolean;
  hostReviewSubmitted: boolean;
  hasDispute: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  listingId: string;
  rating: number;
  content: string;
  tags: string[];
  isHostReview: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: 'text' | 'system' | 'booking';
  bookingId?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  listingId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  images: string[];
  category: string;
  likes: number;
  views: number;
  commentsCount: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
  replyTo?: string;
}

export interface PointRecord {
  id: string;
  userId: string;
  points: number;
  type: 'earn' | 'spend';
  description: string;
  createdAt: string;
  source: 'signin' | 'verify' | 'listing' | 'review' | 'post' | 'like' | 'invite' | 'exchange' | 'other';
}

export interface Dispute {
  id: string;
  bookingId: string;
  complainantId: string;
  defendantId: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
  mediatorId?: string;
}

export interface ExchangeItem {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  category: 'service' | 'feature' | 'merchandise';
  stock?: number;
  isHot?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  listingCount: number;
  isPopular: boolean;
}

export interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minRating?: number;
  propertyType?: string;
  amenities?: string[];
  sortBy?: 'recommended' | 'rating' | 'reviews' | 'newest';
  page?: number;
  pageSize?: number;
}

export const AMENITIES_LIST = [
  { id: 'wifi', name: 'WiFi', icon: 'wifi' },
  { id: 'kitchen', name: '厨房', icon: 'utensils' },
  { id: 'washer', name: '洗衣机', icon: 'washing-machine' },
  { id: 'parking', name: '停车位', icon: 'car' },
  { id: 'aircon', name: '空调', icon: 'thermometer' },
  { id: 'heating', name: '暖气', icon: 'flame' },
  { id: 'tv', name: '电视', icon: 'tv' },
  { id: 'fridge', name: '冰箱', icon: 'refrigerator' },
  { id: 'workspace', name: '工作区', icon: 'monitor' },
  { id: 'gym', name: '健身房', icon: 'dumbbell' },
  { id: 'pool', name: '游泳池', icon: 'waves' },
  { id: 'pets', name: '可带宠物', icon: 'paw-print' },
];

export const PROPERTY_TYPES = [
  { id: 'apartment', name: '公寓' },
  { id: 'house', name: '独立屋' },
  { id: 'room', name: '独立房间' },
  { id: 'studio', name: '单间公寓' },
  { id: 'villa', name: '别墅' },
  { id: 'cabin', name: '木屋' },
  { id: 'loft', name: 'Loft' },
];

export const CATEGORIES = [
  { id: 'travel', name: '旅行分享' },
  { id: 'experience', name: '换宿体验' },
  { id: 'tips', name: '实用攻略' },
  { id: 'food', name: '美食推荐' },
  { id: 'culture', name: '文化交流' },
  { id: 'question', name: '求助问答' },
];

export const REVIEW_TAGS_HOST = [
  '干净整洁',
  '房东热情',
  '位置方便',
  '设施齐全',
  '沟通顺畅',
  '安静舒适',
  '性价比高',
  '安全可靠',
];

export const REVIEW_TAGS_GUEST = [
  '守时',
  '干净整洁',
  '沟通顺畅',
  '尊重规则',
  '友好礼貌',
  '安静',
  '负责任',
  '值得信赖',
];

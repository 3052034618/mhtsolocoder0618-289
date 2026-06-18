import { create } from 'zustand';
import type { User, Listing, Booking, Message, Post, PointRecord } from '@/types';
import { mockCurrentUser, mockListings, mockBookings, mockMessages, mockPosts, mockPointRecords } from '@/services/mock/data';

interface AppState {
  currentUser: User | null;
  isLoggedIn: boolean;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { email: string; password: string; nickname: string }) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  
  listings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, data: Partial<Listing>) => void;
  getListingById: (id: string) => Listing | undefined;
  
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  getBookingsByUser: (userId: string) => Booking[];
  
  messages: Message[];
  addMessage: (message: Message) => void;
  getConversation: (userId1: string, userId2: string) => Message[];
  markAsRead: (conversationId: string) => void;
  
  posts: Post[];
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  
  pointRecords: PointRecord[];
  addPoints: (points: number, description: string, source: string) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockCurrentUser,
  isLoggedIn: true,
  
  login: async (email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email) {
      set({ currentUser: mockCurrentUser, isLoggedIn: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ currentUser: null, isLoggedIn: false });
  },
  
  register: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      phone: '',
      nickname: data.nickname,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
      bio: '',
      isVerified: false,
      verifyStatus: 'none',
      creditScore: 80,
      points: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      languages: [],
      hostingCount: 0,
      travelCount: 0,
    };
    set({ currentUser: newUser, isLoggedIn: true });
    return true;
  },
  
  updateProfile: (data) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
    }));
  },
  
  listings: mockListings,
  
  addListing: (listing) => {
    set((state) => ({
      listings: [listing, ...state.listings],
    }));
  },
  
  updateListing: (id, data) => {
    set((state) => ({
      listings: state.listings.map(l => 
        l.id === id ? { ...l, ...data } : l
      ),
    }));
  },
  
  getListingById: (id) => {
    return get().listings.find(l => l.id === id);
  },
  
  bookings: mockBookings,
  
  addBooking: (booking) => {
    set((state) => ({
      bookings: [booking, ...state.bookings],
    }));
  },
  
  updateBooking: (id, data) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
      ),
    }));
  },
  
  getBookingsByUser: (userId) => {
    return get().bookings.filter(b => b.guestId === userId || b.hostId === userId);
  },
  
  messages: mockMessages,
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  
  getConversation: (userId1, userId2) => {
    return get().messages.filter(m => 
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
  
  markAsRead: () => {
    set((state) => ({
      messages: state.messages.map(m => ({ ...m, isRead: true })),
    }));
  },
  
  posts: mockPosts,
  
  addPost: (post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }));
  },
  
  likePost: (postId) => {
    set((state) => ({
      posts: state.posts.map(p => 
        p.id === postId 
          ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
          : p
      ),
    }));
  },
  
  pointRecords: mockPointRecords,
  
  addPoints: (points, description, source) => {
    const record: PointRecord = {
      id: `point-${Date.now()}`,
      userId: get().currentUser?.id || '',
      points,
      type: 'earn',
      description,
      createdAt: new Date().toISOString(),
      source: source as PointRecord['source'],
    };
    
    set((state) => ({
      pointRecords: [record, ...state.pointRecords],
      currentUser: state.currentUser 
        ? { ...state.currentUser, points: state.currentUser.points + points }
        : null,
    }));
  },
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useAppStore;

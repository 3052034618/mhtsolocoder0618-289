import { create } from 'zustand';
import type { User, Listing, Booking, Message, Post, PointRecord, DateRange, Review } from '@/types';
import { mockCurrentUser, mockListings, mockBookings, mockMessages, mockPosts, mockPointRecords, mockUsers } from '@/services/mock/data';

const isDateInRanges = (dateStr: string, ranges: DateRange[]): boolean => {
  const date = new Date(dateStr);
  return ranges.some(range => 
    date >= new Date(range.startDate) && date <= new Date(range.endDate)
  );
};

const isDateRangeAvailable = (checkIn: string, checkOut: string, ranges: DateRange[]): boolean => {
  if (!checkIn || !checkOut || ranges.length === 0) return false;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return ranges.some(range => 
    start >= new Date(range.startDate) && end <= new Date(range.endDate)
  );
};

interface AppState {
  currentUser: User | null;
  isLoggedIn: boolean;
  users: User[];
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { email: string; password: string; nickname: string }) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => void;
  
  submitIdentityVerify: (realName: string, idCard: string) => void;
  submitAddressVerify: (addressProof: string) => void;
  approveIdentityVerify: (userId: string) => void;
  rejectIdentityVerify: (userId: string) => void;
  approveAddressVerify: (userId: string) => void;
  rejectAddressVerify: (userId: string) => void;
  
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'avgRating' | 'reviewCount'>) => Listing;
  updateListing: (id: string, data: Partial<Listing>) => void;
  getListingById: (id: string) => Listing | undefined;
  getMyListings: (userId: string) => Listing[];
  searchListings: (query: string, checkIn?: string, checkOut?: string, guests?: number) => Listing[];
  addAvailableDate: (listingId: string, startDate: string, endDate: string) => void;
  removeAvailableDate: (listingId: string, dateId: string) => void;
  
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'guestReviewSubmitted' | 'hostReviewSubmitted' | 'hasDispute'>) => Booking;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getBookingById: (id: string) => Booking | undefined;
  acceptBooking: (id: string) => void;
  rejectBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
  completeBooking: (id: string) => void;
  markNoShow: (id: string) => void;
  
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Review;
  getReviewsByListing: (listingId: string) => Review[];
  getReviewsByUser: (userId: string) => Review[];
  
  messages: Message[];
  addMessage: (message: Message) => void;
  getConversation: (userId1: string, userId2: string) => Message[];
  markAsRead: (conversationId: string) => void;
  
  posts: Post[];
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  
  pointRecords: PointRecord[];
  addPoints: (points: number, description: string, source: string) => void;
  spendPoints: (points: number, description: string) => boolean;
  
  canPostListing: (userId: string) => boolean;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockCurrentUser,
  isLoggedIn: true,
  users: mockUsers,
  
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
      addressVerified: false,
      addressVerifyStatus: 'none',
      creditScore: 80,
      points: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      languages: [],
      hostingCount: 0,
      travelCount: 0,
      noShowCount: 0,
    };
    set((state) => ({
      currentUser: newUser,
      isLoggedIn: true,
      users: [newUser, ...state.users],
    }));
    return true;
  },
  
  updateProfile: (data) => {
    set((state) => {
      const updatedUser = state.currentUser ? { ...state.currentUser, ...data } : null;
      return {
        currentUser: updatedUser,
        users: state.users.map(u => 
          u.id === updatedUser?.id ? updatedUser : u
        ),
      };
    });
  },
  
  submitIdentityVerify: (realName, idCard) => {
    set((state) => {
      const updated = {
        realName,
        idCard,
        verifyStatus: 'pending' as const,
      };
      return {
        currentUser: state.currentUser ? { ...state.currentUser, ...updated } : null,
        users: state.users.map(u => 
          u.id === state.currentUser?.id ? { ...u, ...updated } : u
        ),
      };
    });
  },
  
  submitAddressVerify: (addressProof) => {
    set((state) => {
      const updated = {
        addressProof,
        addressVerifyStatus: 'pending' as const,
      };
      return {
        currentUser: state.currentUser ? { ...state.currentUser, ...updated } : null,
        users: state.users.map(u => 
          u.id === state.currentUser?.id ? { ...u, ...updated } : u
        ),
      };
    });
  },
  
  approveIdentityVerify: (userId) => {
    set((state) => ({
      users: state.users.map(u => 
        u.id === userId 
          ? { ...u, isVerified: true, verifyStatus: 'approved' as const, creditScore: u.creditScore + 10 }
          : u
      ),
      currentUser: state.currentUser?.id === userId 
        ? { ...state.currentUser, isVerified: true, verifyStatus: 'approved' as const, creditScore: state.currentUser.creditScore + 10 }
        : state.currentUser,
    }));
  },
  
  rejectIdentityVerify: (userId) => {
    set((state) => ({
      users: state.users.map(u => 
        u.id === userId 
          ? { ...u, isVerified: false, verifyStatus: 'rejected' as const }
          : u
      ),
      currentUser: state.currentUser?.id === userId 
        ? { ...state.currentUser, isVerified: false, verifyStatus: 'rejected' as const }
        : state.currentUser,
    }));
  },
  
  approveAddressVerify: (userId) => {
    set((state) => ({
      users: state.users.map(u => 
        u.id === userId 
          ? { ...u, addressVerified: true, addressVerifyStatus: 'approved' as const, creditScore: u.creditScore + 5 }
          : u
      ),
      currentUser: state.currentUser?.id === userId 
        ? { ...state.currentUser, addressVerified: true, addressVerifyStatus: 'approved' as const, creditScore: state.currentUser.creditScore + 5 }
        : state.currentUser,
    }));
  },
  
  rejectAddressVerify: (userId) => {
    set((state) => ({
      users: state.users.map(u => 
        u.id === userId 
          ? { ...u, addressVerified: false, addressVerifyStatus: 'rejected' as const }
          : u
      ),
      currentUser: state.currentUser?.id === userId 
        ? { ...state.currentUser, addressVerified: false, addressVerifyStatus: 'rejected' as const }
        : state.currentUser,
    }));
  },
  
  listings: mockListings,
  
  addListing: (listingData) => {
    const newListing: Listing = {
      ...listingData,
      id: `listing-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avgRating: 0,
      reviewCount: 0,
    };
    set((state) => ({
      listings: [newListing, ...state.listings],
    }));
    return newListing;
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
  
  getMyListings: (userId) => {
    return get().listings.filter(l => l.hostId === userId);
  },
  
  searchListings: (query, checkIn, checkOut, guests) => {
    let results = get().listings.filter(l => l.status === 'active');
    
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(l => 
        l.title.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.district?.toLowerCase().includes(q)
      );
    }
    
    if (checkIn && checkOut) {
      results = results.filter(l => isDateRangeAvailable(checkIn, checkOut, l.availableDates));
    }
    
    if (guests) {
      results = results.filter(l => l.maxGuests >= guests);
    }
    
    return results;
  },
  
  addAvailableDate: (listingId, startDate, endDate) => {
    const newDate: DateRange = {
      id: `date-${Date.now()}`,
      startDate,
      endDate,
    };
    set((state) => ({
      listings: state.listings.map(l => 
        l.id === listingId 
          ? { ...l, availableDates: [...l.availableDates, newDate] }
          : l
      ),
    }));
  },
  
  removeAvailableDate: (listingId, dateId) => {
    set((state) => ({
      listings: state.listings.map(l => 
        l.id === listingId 
          ? { ...l, availableDates: l.availableDates.filter(d => d.id !== dateId) }
          : l
      ),
    }));
  },
  
  bookings: mockBookings,
  
  addBooking: (bookingData) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      guestReviewSubmitted: false,
      hostReviewSubmitted: false,
      hasDispute: false,
    };
    set((state) => ({
      bookings: [newBooking, ...state.bookings],
    }));
    return newBooking;
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
  
  getBookingById: (id) => {
    return get().bookings.find(b => b.id === id);
  },
  
  acceptBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === id 
          ? { ...b, status: 'accepted' as const, updatedAt: new Date().toISOString() } 
          : b
      ),
    }));
  },
  
  rejectBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === id 
          ? { ...b, status: 'rejected' as const, updatedAt: new Date().toISOString() } 
          : b
      ),
    }));
  },
  
  cancelBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === id 
          ? { ...b, status: 'cancelled' as const, updatedAt: new Date().toISOString() } 
          : b
      ),
    }));
  },
  
  completeBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.map(b => 
        b.id === id 
          ? { ...b, status: 'completed' as const, updatedAt: new Date().toISOString() } 
          : b
      ),
    }));
  },
  
  markNoShow: (id) => {
    const booking = get().bookings.find(b => b.id === id);
    if (!booking) return;
    
    set((state) => {
      const updatedGuest = state.users.find(u => u.id === booking.guestId);
      const newNoShowCount = (updatedGuest?.noShowCount || 0) + 1;
      const newCreditScore = Math.max(0, (updatedGuest?.creditScore || 80) - 15);
      
      return {
        bookings: state.bookings.map(b => 
          b.id === id 
            ? { ...b, status: 'no_show' as const, updatedAt: new Date().toISOString() } 
            : b
        ),
        users: state.users.map(u => 
          u.id === booking.guestId
            ? { ...u, noShowCount: newNoShowCount, creditScore: newCreditScore }
            : u
        ),
        currentUser: state.currentUser?.id === booking.guestId
          ? { ...state.currentUser, noShowCount: newNoShowCount, creditScore: newCreditScore }
          : state.currentUser,
      };
    });
  },
  
  reviews: [],
  
  addReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => {
      let updatedListing = null;
      let updatedReviewee = null;
      let creditScoreChange = 0;
      
      if (reviewData.isHostReview) {
        const listing = state.listings.find(l => l.id === reviewData.listingId);
        if (listing) {
          const allReviews = [...state.reviews.filter(r => r.listingId === reviewData.listingId && r.isHostReview), newReview];
          const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
          updatedListing = {
            ...listing,
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount: allReviews.length,
          };
        }
        creditScoreChange = reviewData.rating >= 4 ? 2 : reviewData.rating <= 2 ? -3 : 0;
      } else {
        creditScoreChange = reviewData.rating >= 4 ? 2 : reviewData.rating <= 2 ? -3 : 0;
      }
      
      const reviewee = state.users.find(u => u.id === reviewData.revieweeId);
      if (reviewee) {
        updatedReviewee = {
          ...reviewee,
          creditScore: Math.min(100, Math.max(0, reviewee.creditScore + creditScoreChange)),
        };
      }
      
      const updatedBookings = state.bookings.map(b => {
        if (b.id !== reviewData.bookingId) return b;
        return reviewData.isHostReview
          ? { ...b, guestReviewSubmitted: true }
          : { ...b, hostReviewSubmitted: true };
      });
      
      const reviewer = state.users.find(u => u.id === reviewData.reviewerId);
      const reviewerPoints = reviewer ? reviewer.points + 5 : 0;
      
      const pointRecord: PointRecord = {
        id: `point-${Date.now()}`,
        userId: reviewData.reviewerId,
        points: 5,
        type: 'earn',
        description: '完成评价获得积分',
        createdAt: new Date().toISOString(),
        source: 'review',
      };
      
      return {
        reviews: [newReview, ...state.reviews],
        listings: updatedListing 
          ? state.listings.map(l => l.id === updatedListing.id ? updatedListing : l)
          : state.listings,
        users: state.users.map(u => {
          if (u.id === reviewData.revieweeId && updatedReviewee) return updatedReviewee;
          if (u.id === reviewData.reviewerId) return { ...u, points: reviewerPoints };
          return u;
        }),
        currentUser: state.currentUser?.id === reviewData.reviewerId
          ? { ...state.currentUser, points: reviewerPoints }
          : state.currentUser,
        bookings: updatedBookings,
        pointRecords: [pointRecord, ...state.pointRecords],
      };
    });
    
    return newReview;
  },
  
  getReviewsByListing: (listingId) => {
    return get().reviews.filter(r => r.listingId === listingId && r.isHostReview);
  },
  
  getReviewsByUser: (userId) => {
    return get().reviews.filter(r => r.revieweeId === userId);
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
  
  addPost: (postData) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 0,
      views: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    };
    
    set((state) => {
      const pointRecord: PointRecord = {
        id: `point-${Date.now()}`,
        userId: newPost.authorId,
        points: 10,
        type: 'earn',
        description: '发布帖子获得积分',
        createdAt: new Date().toISOString(),
        source: 'post',
      };
      
      return {
        posts: [newPost, ...state.posts],
        pointRecords: [pointRecord, ...state.pointRecords],
        currentUser: state.currentUser?.id === newPost.authorId
          ? { ...state.currentUser, points: state.currentUser.points + 10 }
          : state.currentUser,
        users: state.users.map(u => 
          u.id === newPost.authorId
            ? { ...u, points: u.points + 10 }
            : u
        ),
      };
    });
    
    return newPost;
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
    const userId = get().currentUser?.id || '';
    const record: PointRecord = {
      id: `point-${Date.now()}`,
      userId,
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
      users: state.users.map(u => 
        u.id === userId 
          ? { ...u, points: u.points + points }
          : u
      ),
    }));
  },
  
  spendPoints: (points, description) => {
    const userId = get().currentUser?.id || '';
    const currentPoints = get().currentUser?.points || 0;
    
    if (currentPoints < points) {
      return false;
    }
    
    const record: PointRecord = {
      id: `point-${Date.now()}`,
      userId,
      points,
      type: 'spend',
      description,
      createdAt: new Date().toISOString(),
      source: 'exchange',
    };
    
    set((state) => ({
      pointRecords: [record, ...state.pointRecords],
      currentUser: state.currentUser 
        ? { ...state.currentUser, points: state.currentUser.points - points }
        : null,
      users: state.users.map(u => 
        u.id === userId 
          ? { ...u, points: u.points - points }
          : u
      ),
    }));
    
    return true;
  },
  
  canPostListing: (userId) => {
    const user = get().users.find(u => u.id === userId);
    if (!user) return false;
    if (user.noShowCount && user.noShowCount >= 3) return false;
    if (user.creditScore < 60) return false;
    return true;
  },
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useAppStore;

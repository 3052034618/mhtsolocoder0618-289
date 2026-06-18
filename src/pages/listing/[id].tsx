import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Shield, 
  MapPin, 
  Users, 
  Bed, 
  Bath,
  Heart,
  MessageCircle,
  Calendar,
  Check,
  X,
  Wifi,
  Tv,
  Car,
  Wind,
  Flame,
  Snowflake,
  Monitor,
  Utensils,
  WashingMachine,
  PawPrint,
  Dumbbell,
  Waves,
  Refrigerator,
  Clock
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { mockUsers } from '@/services/mock/data';
import { AMENITIES_LIST, REVIEW_TAGS_HOST } from '@/types';

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-5 h-5" />,
  kitchen: <Utensils className="w-5 h-5" />,
  washer: <WashingMachine className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  aircon: <Snowflake className="w-5 h-5" />,
  heating: <Flame className="w-5 h-5" />,
  tv: <Tv className="w-5 h-5" />,
  fridge: <Refrigerator className="w-5 h-5" />,
  workspace: <Monitor className="w-5 h-5" />,
  gym: <Dumbbell className="w-5 h-5" />,
  pool: <Waves className="w-5 h-5" />,
  pets: <PawPrint className="w-5 h-5" />,
};

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListingById, isLoggedIn, currentUser } = useAppStore();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');

  const listing = getListingById(id || '');
  const host = listing ? mockUsers.find(u => u.id === listing.hostId) : null;

  if (!listing || !host) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">房源不存在</h2>
          <Link to="/search" className="text-primary-600 hover:underline">
            返回搜索结果
          </Link>
        </div>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === listing.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? listing.photos.length - 1 : prev - 1
    );
  };

  const handleBooking = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const submitBooking = () => {
    alert('预约申请已发送！房东会尽快回复您。');
    setShowBookingModal(false);
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Photo Gallery */}
      <div className="relative bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/search" 
            className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回搜索结果
          </Link>
        </div>
        
        <div className="relative h-[500px] max-w-6xl mx-auto">
          <img 
            src={listing.photos[currentPhotoIndex]?.url} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          <button 
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button 
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <button className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>

          {/* Photo Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {listing.photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentPhotoIndex 
                    ? 'border-white shadow-lg scale-110' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={photo.url} 
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {listing.city} · {listing.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {listing.reviewCount > 0 
                        ? `${listing.avgRating.toFixed(1)} (${listing.reviewCount}条评价)` 
                        : '暂无评价'
                      }
                    </span>
                  </div>
                </div>
                {listing.isFree && (
                  <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl shadow-md">
                    免费换宿
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.highlights?.map((highlight, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-secondary-50 text-secondary-600 rounded-full text-sm font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-gray-600 border-t border-gray-100 pt-4">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  可住 {listing.maxGuests} 人
                </span>
                <span className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-400" />
                  {listing.bedrooms} 卧室 · {listing.beds} 床
                </span>
                <span className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-400" />
                  {listing.bathrooms} 卫生间
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">房源描述</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">房源设施</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenityId) => {
                  const amenity = AMENITIES_LIST.find(a => a.id === amenityId);
                  if (!amenity) return null;
                  return (
                    <div 
                      key={amenityId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-500 shadow-sm">
                        {amenityIcons[amenityId] || <Wind className="w-5 h-5" />}
                      </div>
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">生活规则</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {listing.houseRules.map((rule, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl"
                  >
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  评价 ({listing.reviewCount})
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-lg font-bold text-gray-900">{listing.avgRating.toFixed(1)}</span>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                {REVIEW_TAGS_HOST.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {[
                  {
                    id: '1',
                    user: mockUsers[1],
                    rating: 5,
                    content: '非常棒的体验！四合院很有北京特色，房东人也很热情，给我们推荐了很多好吃的地方。位置也很好，去哪都方便。强烈推荐！',
                    date: '2024年7月',
                  },
                  {
                    id: '2',
                    user: mockUsers[3],
                    rating: 4,
                    content: '整体很不错，位置便利，房间干净。唯一的小缺点是卫生间稍微小了一点，但完全可以接受。',
                    date: '2024年6月',
                  },
                ].map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <img 
                      src={review.user.avatar} 
                      alt={review.user.nickname}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{review.user.nickname}</span>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${
                              i < review.rating 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors">
                查看全部 {listing.reviewCount} 条评价
              </button>
            </div>
          </div>

          {/* Sidebar - Host & Booking */}
          <div className="space-y-6">
            {/* Host Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={host.avatar} 
                  alt={host.nickname}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-50"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{host.nickname}</h3>
                    {host.isVerified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{host.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mb-6 py-4 border-y border-gray-100">
                <div>
                  <p className="text-xl font-bold text-gray-900">{host.creditScore}</p>
                  <p className="text-xs text-gray-500">信用分</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{host.hostingCount}</p>
                  <p className="text-xs text-gray-500">接待次数</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{host.responseRate}%</p>
                  <p className="text-xs text-gray-500">回复率</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>实名认证</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>地址核验</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>已通过平台审核</span>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md hover:shadow-lg mb-3"
              >
                立即申请入住
              </button>

              <Link 
                to={`/messages/new?userId=${host.id}`}
                className="w-full py-3 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                联系房东
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowBookingModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">申请入住</h2>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <img 
                src={listing.coverPhoto} 
                alt={listing.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.city}</p>
                <p className="text-sm text-primary-600 font-medium mt-1">免费换宿</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">入住日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">退房日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">入住人数</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    {[...Array(listing.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} 人</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">给房东留言</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="简单介绍一下自己和此行的目的..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>温馨提示：</strong>提交申请后，房东会在24小时内回复。
                请保持礼貌，认真沟通，建立良好的换宿关系。
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={submitBooking}
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

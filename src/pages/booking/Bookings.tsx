import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Check, 
  X, 
  MessageCircle,
  Star,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function Bookings() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>(
    typeParam === 'sent' ? 'sent' : 'received'
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { bookings, currentUser, acceptBooking, rejectBooking, listings, users } = useAppStore();

  useEffect(() => {
    if (typeParam === 'sent') {
      setActiveTab('sent');
    } else if (typeParam === 'received') {
      setActiveTab('received');
    }
  }, [typeParam]);

  const myBookings = bookings.filter(b => 
    activeTab === 'received' 
      ? b.hostId === currentUser?.id
      : b.guestId === currentUser?.id
  );

  const sortedBookings = [...myBookings].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    if (activeTab === 'received' && a.status === 'pending' && b.status === 'pending') {
      const guestA = users.find(u => u.id === a.guestId);
      const guestB = users.find(u => u.id === b.guestId);
      const scoreA = guestA?.creditScore || 0;
      const scoreB = guestB?.creditScore || 0;
      const noShowA = guestA?.noShowCount || 0;
      const noShowB = guestB?.noShowCount || 0;
      const rankA = scoreA - noShowA * 10;
      const rankB = scoreB - noShowB * 10;
      return rankB - rankA;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '待确认', className: 'badge-warning', icon: <Clock className="w-3.5 h-3.5" /> };
      case 'accepted':
        return { label: '已接受', className: 'badge-success', icon: <Check className="w-3.5 h-3.5" /> };
      case 'rejected':
        return { label: '已拒绝', className: 'badge-error', icon: <X className="w-3.5 h-3.5" /> };
      case 'cancelled':
        return { label: '已取消', className: 'bg-gray-100 text-gray-500', icon: <X className="w-3.5 h-3.5" /> };
      case 'completed':
        return { label: '已完成', className: 'badge-success', icon: <Check className="w-3.5 h-3.5" /> };
      case 'no_show':
        return { label: '爽约', className: 'badge-error', icon: <X className="w-3.5 h-3.5" /> };
      default:
        return { label: status, className: 'badge-primary', icon: null };
    }
  };

  const handleAccept = (id: string) => {
    acceptBooking(id);
  };

  const handleReject = (id: string) => {
    rejectBooking(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const nights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const tabs = [
    { key: 'received', label: '收到的申请', count: bookings.filter(b => b.hostId === currentUser?.id).length },
    { key: 'sent', label: '发出的申请', count: bookings.filter(b => b.guestId === currentUser?.id).length },
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">我的预订</h1>
          <p className="text-gray-500">查看和管理你的换宿申请</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card p-1 mb-6 inline-flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'received' | 'sent')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-sm ${
                activeTab === tab.key ? 'text-white/80' : 'text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {sortedBookings.length > 0 ? (
            sortedBookings.map((booking) => {
              const listing = listings.find(l => l.id === booking.listingId);
              const otherUser = activeTab === 'received'
                ? users.find(u => u.id === booking.guestId)
                : users.find(u => u.id === booking.hostId);
              const statusInfo = getStatusInfo(booking.status);
              const isExpanded = expandedId === booking.id;
              const noShowCount = otherUser?.noShowCount || 0;

              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-card overflow-hidden"
                >
                  <div 
                    className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => toggleExpand(booking.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Listing Image */}
                      <img 
                        src={listing?.coverPhoto} 
                        alt=""
                        className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{listing?.title}</h3>
                          <span className={`inline-flex items-center gap-1 ${statusInfo.className} px-2 py-0.5 rounded-full text-xs`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            <span className="ml-1 text-gray-400">({nights(booking.checkIn, booking.checkOut)}晚)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {booking.guests}人
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <img 
                            src={otherUser?.avatar} 
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            {activeTab === 'received' ? '申请人：' : '房东：'}{otherUser?.nickname}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        {isExpanded 
                          ? <ChevronUp className="w-5 h-5" />
                          : <ChevronDown className="w-5 h-5" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Guest/Host Info */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {activeTab === 'received' ? '申请人信息' : '房东信息'}
                          </h4>
                          <div className="flex items-center gap-3 mb-3">
                            <img 
                              src={otherUser?.avatar} 
                              alt=""
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{otherUser?.nickname}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-400" />
                                  {otherUser?.creditScore}分
                                </span>
                                {otherUser?.isVerified && (
                                  <span className="text-green-600 text-xs">已认证</span>
                                )}
                                {noShowCount > 0 && (
                                  <span className="text-red-500 text-xs flex items-center gap-0.5">
                                    <AlertTriangle className="w-3 h-3" />
                                    {noShowCount}次爽约
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {booking.message && (
                            <div className="mt-3 p-3 bg-white rounded-lg">
                              <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-3">
                          {booking.status === 'pending' && activeTab === 'received' && (
                            <>
                              <button
                                onClick={() => handleAccept(booking.id)}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-400 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-500 transition-all"
                              >
                                <Check className="w-5 h-5 inline mr-2" />
                                接受申请
                              </button>
                              <button
                                onClick={() => handleReject(booking.id)}
                                className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all"
                              >
                                <X className="w-5 h-5 inline mr-2" />
                                拒绝申请
                              </button>
                            </>
                          )}

                          {booking.status === 'accepted' && (
                            <>
                              <Link
                                to={`/messages/${activeTab === 'received' ? booking.guestId : booking.hostId}`}
                                className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all text-center"
                              >
                                <MessageCircle className="w-5 h-5 inline mr-2" />
                                联系对方
                              </Link>
                              {activeTab === 'sent' && (
                                <button className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all">
                                  取消预订
                                </button>
                              )}
                            </>
                          )}

                          {booking.status === 'completed' && (
                            <>
                              {!booking.guestReviewSubmitted && activeTab === 'sent' ? (
                                <Link
                                  to={`/review/${booking.id}`}
                                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-500 transition-all text-center"
                                >
                                  <Star className="w-5 h-5 inline mr-2" />
                                  去评价
                                </Link>
                              ) : !booking.hostReviewSubmitted && activeTab === 'received' ? (
                                <Link
                                  to={`/review/${booking.id}`}
                                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-500 transition-all text-center"
                                >
                                  <Star className="w-5 h-5 inline mr-2" />
                                  去评价
                                </Link>
                              ) : (
                                <p className="text-center text-green-600 font-medium">
                                  ✓ 已完成评价
                                </p>
                              )}
                              <button className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all">
                                发起争议
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-3">预订详情</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">入住日期</p>
                            <p className="font-medium text-gray-900">{formatDate(booking.checkIn)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">退房日期</p>
                            <p className="font-medium text-gray-900">{formatDate(booking.checkOut)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">入住人数</p>
                            <p className="font-medium text-gray-900">{booking.guests} 人</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">房源位置</p>
                            <p className="font-medium text-gray-900 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {listing?.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                暂无{activeTab === 'received' ? '收到的申请' : '发出的申请'}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'received' 
                  ? '还没有人申请你的房源' 
                  : '你还没有发出过换宿申请'}
              </p>
              <Link 
                to={activeTab === 'received' ? '/my-listings/new' : '/search'}
                className="btn-primary inline-block"
              >
                {activeTab === 'received' ? '去发布房源' : '去找房源'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

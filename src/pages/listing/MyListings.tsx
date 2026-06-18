import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Eye, 
  Calendar,
  Trash2,
  EyeOff,
  Clock,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { mockUsers } from '@/services/mock/data';
import type { DateRange } from '@/types';

export default function MyListings() {
  const { listings, currentUser, updateListing, addAvailableDate, removeAvailableDate } = useAppStore();
  const [expandedCalendar, setExpandedCalendar] = useState<string | null>(null);
  const [newDateStart, setNewDateStart] = useState('');
  const [newDateEnd, setNewDateEnd] = useState('');
  
  const myListings = listings.filter(l => l.hostId === currentUser?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge-success">已上线</span>;
      case 'pending':
        return <span className="badge-warning">审核中</span>;
      case 'rejected':
        return <span className="badge-error">已拒绝</span>;
      case 'offline':
        return <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-medium">已下架</span>;
      default:
        return null;
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'offline' : 'active';
    updateListing(id, { status: newStatus });
  };

  const handleToggleCalendar = (listingId: string) => {
    if (expandedCalendar === listingId) {
      setExpandedCalendar(null);
      setNewDateStart('');
      setNewDateEnd('');
    } else {
      setExpandedCalendar(listingId);
      setNewDateStart('');
      setNewDateEnd('');
    }
  };

  const handleAddDate = (listingId: string) => {
    if (newDateStart && newDateEnd && newDateStart < newDateEnd) {
      addAvailableDate(listingId, newDateStart, newDateEnd);
      setNewDateStart('');
      setNewDateEnd('');
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">我的房源</h1>
            <p className="text-gray-500">管理你发布的所有房源</p>
          </div>
          <Link 
            to="/my-listings/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            发布新房源
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myListings.filter(l => l.status === 'active').length}</p>
                <p className="text-sm text-gray-500">已上线</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myListings.filter(l => l.status === 'pending').length}</p>
                <p className="text-sm text-gray-500">审核中</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{currentUser?.hostingCount || 0}</p>
                <p className="text-sm text-gray-500">接待次数</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myListings.filter(l => l.status === 'rejected').length}</p>
                <p className="text-sm text-gray-500">已拒绝</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden group"
              >
                <div className="relative aspect-[4/3]">
                  <img 
                    src={listing.coverPhoto} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(listing.status)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{listing.city} · {listing.district}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{listing.bedrooms}卧</span>
                    <span>{listing.bathrooms}卫</span>
                    <span>可住{listing.maxGuests}人</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-sm font-medium">
                        {listing.reviewCount > 0 
                          ? `${listing.avgRating.toFixed(1)} (${listing.reviewCount}条评价)`
                          : '暂无评价'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/my-listings/${listing.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleCalendar(listing.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          expandedCalendar === listing.id
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(listing.id, listing.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          listing.status === 'active'
                            ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                            : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                        }`}
                      >
                        {listing.status === 'active' 
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {expandedCalendar === listing.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        可入住时间段
                      </h4>
                      
                      {listing.availableDates?.length > 0 ? (
                        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                          {listing.availableDates.map((dateRange) => (
                            <div 
                              key={dateRange.id}
                              className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm text-gray-700">
                                {dateRange.startDate} 至 {dateRange.endDate}
                              </span>
                              <button 
                                onClick={() => removeAvailableDate(listing.id, dateRange.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 mb-4">暂无可用时间段</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="date"
                            value={newDateStart}
                            onChange={(e) => setNewDateStart(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                        </div>
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="date"
                            value={newDateEnd}
                            onChange={(e) => setNewDateEnd(e.target.value)}
                            className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-300"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddDate(listing.id)}
                        disabled={!newDateStart || !newDateEnd || newDateStart >= newDateEnd}
                        className="w-full py-2 border border-dashed border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        添加时间段
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有发布房源</h3>
            <p className="text-gray-500 mb-6">发布你的第一个房源，开始换宿之旅吧</p>
            <Link 
              to="/my-listings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              立即发布
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

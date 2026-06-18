import { Link } from 'react-router-dom';
import { Star, Shield, MapPin, Users, Heart } from 'lucide-react';
import type { Listing, User } from '@/types';

interface ListingCardProps {
  listing: Listing;
  host?: User;
  showHeart?: boolean;
}

export default function ListingCard({ listing, host, showHeart = true }: ListingCardProps) {
  return (
    <Link 
      to={`/listing/${listing.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={listing.coverPhoto} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {listing.status === 'active' && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-green-600">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              可预订
            </span>
          </div>
        )}
        
        {listing.status === 'pending' && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/90 backdrop-blur-sm rounded-full text-xs font-medium text-amber-700">
              审核中
            </span>
          </div>
        )}

        {showHeart && (
          <button 
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
        )}

        {listing.isFree && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-400 text-white text-sm font-semibold rounded-full shadow-md">
              免费换宿
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-700">
              {listing.reviewCount > 0 ? listing.avgRating.toFixed(1) : '暂无'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{listing.city} · {listing.district || '市中心'}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {listing.maxGuests}人
          </span>
          <span>{listing.bedrooms}卧</span>
          <span>{listing.bathrooms}卫</span>
        </div>

        {host && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <img 
                src={host.avatar} 
                alt={host.nickname}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
              />
              <span className="text-sm text-gray-600 truncate">{host.nickname}</span>
            </div>
            {host.isVerified && (
              <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" />
                认证
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, MapPin, X, Users, ChevronDown } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import ListingCard from '@/components/common/ListingCard';
import { mockUsers } from '@/services/mock/data';
import { AMENITIES_LIST, PROPERTY_TYPES } from '@/types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const { listings } = useAppStore();

  const city = searchParams.get('city') || '';
  const [searchCity, setSearchCity] = useState(city);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [guests, setGuests] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity) {
      setSearchParams({ city: searchCity });
    } else {
      setSearchParams({});
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedAmenities([]);
    setSelectedPropertyType('');
    setMinRating(0);
    setGuests(0);
  };

  const filteredListings = useMemo(() => {
    let result = listings.filter(l => l.status === 'active');

    if (city) {
      result = result.filter(l => 
        l.city.toLowerCase().includes(city.toLowerCase()) ||
        l.title.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (selectedPropertyType) {
      result = result.filter(l => l.propertyType === selectedPropertyType);
    }

    if (minRating > 0) {
      result = result.filter(l => l.avgRating >= minRating);
    }

    if (guests > 0) {
      result = result.filter(l => l.maxGuests >= guests);
    }

    if (selectedAmenities.length > 0) {
      result = result.filter(l => 
        selectedAmenities.every(a => l.amenities.includes(a))
      );
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [listings, city, selectedPropertyType, minRating, guests, selectedAmenities, sortBy]);

  const activeFiltersCount = 
    (selectedAmenities.length > 0 ? 1 : 0) +
    (selectedPropertyType ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (guests > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索目的地城市..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">搜索</span>
            </button>
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">筛选</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-gray-50 rounded-xl animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">筛选条件</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  清除全部
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 房型 */}
                <div>
                  <label className="input-label">房屋类型</label>
                  <div className="relative">
                    <select
                      value={selectedPropertyType}
                      onChange={(e) => setSelectedPropertyType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value="">全部类型</option>
                      {PROPERTY_TYPES.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* 人数 */}
                <div>
                  <label className="input-label">可住人数</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value={0}>不限</option>
                      <option value={1}>1人以上</option>
                      <option value={2}>2人以上</option>
                      <option value={3}>3人以上</option>
                      <option value={4}>4人以上</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* 评分 */}
                <div>
                  <label className="input-label">最低评分</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value={0}>不限</option>
                      <option value={3}>3分以上</option>
                      <option value={4}>4分以上</option>
                      <option value={4.5}>4.5分以上</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 设施 */}
              <div className="mt-6">
                <label className="input-label">房源设施</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map(amenity => (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedAmenities.includes(amenity.id)
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {amenity.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {city ? `${city}的房源` : '全部房源'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              共找到 <span className="font-semibold text-primary-600">{filteredListings.length}</span> 处房源
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="recommended">推荐排序</option>
              <option value="rating">评分最高</option>
              <option value="reviews">评价最多</option>
              <option value="newest">最新发布</option>
            </select>
          </div>
        </div>

        {/* Active Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">已选条件：</span>
            {selectedPropertyType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                {PROPERTY_TYPES.find(t => t.id === selectedPropertyType)?.name}
                <button onClick={() => setSelectedPropertyType('')}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {guests > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                {guests}人以上
                <button onClick={() => setGuests(0)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                {minRating}分以上
                <button onClick={() => setMinRating(0)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedAmenities.map(a => (
              <span key={a} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                {AMENITIES_LIST.find(am => am.id === a)?.name}
                <button onClick={() => toggleAmenity(a)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const host = mockUsers.find(u => u.id === listing.hostId);
              return (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  host={host}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到符合条件的房源</h3>
            <p className="text-gray-500 mb-6">试试调整筛选条件或搜索其他城市</p>
            <button 
              onClick={clearFilters}
              className="btn-primary"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Users, 
  ArrowRight, 
  MapPin,
  Star,
  Shield,
  Heart,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import ListingCard from '@/components/common/ListingCard';
import { mockDestinations, mockUsers, mockPosts } from '@/services/mock/data';

export default function Home() {
  const [searchCity, setSearchCity] = useState('');
  const navigate = useNavigate();
  const { listings } = useAppStore();
  
  const activeListings = listings.filter(l => l.status === 'active').slice(0, 6);
  const popularDestinations = mockDestinations.filter(d => d.isPopular).slice(0, 8);
  const topHosts = mockUsers
    .filter(u => u.isVerified && u.id !== 'user-6')
    .sort((a, b) => b.creditScore - a.creditScore)
    .slice(0, 4);
  const latestPosts = mockPosts.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/search?city=${encodeURIComponent(searchCity)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&h=800&fit=crop" 
            alt="温馨的家"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 via-secondary-800/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm mb-6">
              <Heart className="w-4 h-4 text-primary-400" />
              <span>让旅行不再昂贵，让交换充满温暖</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              用你的<span className="text-primary-400">空房</span>
              <br />
              换世界的<span className="text-accent-400">风景</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              加入全球最大的换宿社区，与来自世界各地的旅行者免费交换住宿。
              <br />
              省钱、交友、体验真实的当地生活。
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索目的地城市..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  />
                </div>
                
                <div className="md:w-36 relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                  />
                </div>
                
                <div className="md:w-32 relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all appearance-none">
                    <option>1人</option>
                    <option>2人</option>
                    <option>3人</option>
                    <option>4人+</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="md:w-auto px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="md:inline hidden">搜索房源</span>
                </button>
              </div>
            </form>

            <div className="flex items-center gap-6 mt-8 text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">实名认证</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-sm">信用评分</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span className="text-sm">安全沟通</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-float">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=40&h=40&fit=crop&crop=face`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/40/40?random=${i}`;
                    }}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">10,000+ 会员</p>
                <p className="text-xs text-gray-500">正在等待换宿</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">热门目的地</h2>
              <p className="text-gray-500">发现更多精彩城市，开启你的换宿之旅</p>
            </div>
            <Link 
              to="/search" 
              className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/search?city=${encodeURIComponent(dest.name)}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                  <p className="text-sm text-white/80">{dest.listingCount} 处房源</p>
                </div>
                {dest.isPopular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                      热门
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-warm-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">精选房源</h2>
              <p className="text-gray-500">来自优质房东的特色房源</p>
            </div>
            <Link 
              to="/search" 
              className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              浏览更多
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeListings.map((listing) => {
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">换宿，就这么简单</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              三步开启你的免费换宿之旅，用空余房间换全世界的风景
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Shield className="w-8 h-8" />,
                title: '注册认证',
                desc: '完成注册和实名认证，建立你的个人资料和信用档案',
                color: 'from-primary-500 to-primary-400',
              },
              {
                step: '02',
                icon: <MapPin className="w-8 h-8" />,
                title: '发布房源',
                desc: '发布你的空余房间，设置可预订日期和生活规则',
                color: 'from-secondary-500 to-secondary-400',
              },
              {
                step: '03',
                icon: <TrendingUp className="w-8 h-8" />,
                title: '开启换宿',
                desc: '搜索目的地房源，与房东沟通，开启免费换宿体验',
                color: 'from-amber-500 to-amber-400',
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-card transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="absolute top-6 right-6 text-5xl font-bold text-gray-100">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Hosts */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">优质房东</h2>
            <p className="text-gray-500">信用好、评价高的认证房东</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topHosts.map((host) => (
              <Link
                key={host.id}
                to={`/user/${host.id}`}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-card transition-all duration-300 group"
              >
                <div className="relative inline-block mb-4">
                  <img 
                    src={host.avatar} 
                    alt={host.nickname}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform"
                  />
                  {host.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                      <Shield className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{host.nickname}</h3>
                <p className="text-sm text-gray-500 mb-3">{host.location}</p>
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-medium">{host.creditScore}</span>
                  <span className="text-gray-400 text-sm">信用分</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                  <span>接待 {host.hostingCount} 次</span>
                  <span>·</span>
                  <span>旅行 {host.travelCount} 次</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">社区动态</h2>
              <p className="text-gray-500">看看大家的换宿故事和旅行分享</p>
            </div>
            <Link 
              to="/forum" 
              className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              进入论坛
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => {
              const author = mockUsers.find(u => u.id === post.authorId);
              return (
                <Link
                  key={post.id}
                  to={`/forum/${post.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 group"
                >
                  {post.images[0] && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.images[0]} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={author?.avatar} 
                          alt={author?.nickname}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-600">{author?.nickname}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {post.commentsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-primary-500 via-primary-400 to-amber-400 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                准备好开始你的换宿之旅了吗？
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                加入换宿家社区，用你的空余房间，换取世界各地的免费住宿体验
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/register"
                  className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  立即加入
                </Link>
                <Link 
                  to="/search"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30"
                >
                  浏览房源
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

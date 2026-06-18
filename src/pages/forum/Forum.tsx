import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Heart, 
  MessageCircle, 
  Eye,
  TrendingUp,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { mockUsers } from '@/services/mock/data';
import { CATEGORIES } from '@/types';

export default function Forum() {
  const { posts, likePost, isLoggedIn } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    if (activeCategory && post.category !== activeCategory) return false;
    if (searchQuery && !post.title.includes(searchQuery) && !post.content.includes(searchQuery)) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'new':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'hot':
      default:
        return b.likes - a.likes;
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const hotTopics = [
    { tag: '北京换宿', count: 128 },
    { tag: '上海攻略', count: 96 },
    { tag: '新手必看', count: 85 },
    { tag: '美食推荐', count: 72 },
    { tag: '安全注意', count: 64 },
  ];

  const activeUsers = mockUsers
    .filter(u => u.id !== 'user-6')
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">社区论坛</h1>
          <p className="text-white/80">分享旅行故事，交流换宿经验</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-card mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索帖子..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                
                {isLoggedIn && (
                  <Link 
                    to="/forum/new"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                    发布帖子
                  </Link>
                )}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setActiveCategory('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    !activeCategory 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">排序：</span>
                  <button
                    onClick={() => setSortBy('hot')}
                    className={`text-sm font-medium ${
                      sortBy === 'hot' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    热门
                  </button>
                  <button
                    onClick={() => setSortBy('new')}
                    className={`text-sm font-medium ${
                      sortBy === 'new' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    最新
                  </button>
                </div>
                <span className="text-sm text-gray-500">共 {filteredPosts.length} 篇帖子</span>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const author = mockUsers.find(u => u.id === post.authorId);
                const category = CATEGORIES.find(c => c.id === post.category);
                return (
                  <Link
                    key={post.id}
                    to={`/forum/${post.id}`}
                    className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
                  >
                    <div className="flex gap-4">
                      {post.images[0] && (
                        <div className="w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                          <img 
                            src={post.images[0]} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full">
                            {category?.name || '其他'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-primary-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={author?.avatar} 
                              alt=""
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600">{author?.nickname}</span>
                            <span className="text-sm text-gray-400">·</span>
                            <span className="text-sm text-gray-400">{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.commentsCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-card">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">没有找到相关帖子</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Topics */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  热门话题
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {hotTopics.map((topic, index) => (
                  <button
                    key={topic.tag}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 text-left text-sm text-gray-700">{topic.tag}</span>
                    <span className="text-xs text-gray-400">{topic.count}讨论</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">活跃用户</h3>
              </div>
              <div className="p-4 space-y-3">
                {activeUsers.map((user, index) => (
                  <Link
                    key={user.id}
                    to={`/user/${user.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <img 
                      src={user.avatar} 
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.nickname}</p>
                      <p className="text-xs text-gray-500">{user.points} 积分</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Post Guide */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">发帖指南</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• 分享真实的换宿经历</li>
                <li>• 图片清晰，内容丰富</li>
                <li>• 友善交流，互帮互助</li>
                <li>• 遵守社区规范</li>
              </ul>
              {isLoggedIn ? (
                <Link 
                  to="/forum/new"
                  className="mt-4 block w-full py-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-center font-medium hover:bg-white/30 transition-colors"
                >
                  立即发帖
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="mt-4 block w-full py-2.5 bg-white/20 backdrop-blur-sm rounded-lg text-center font-medium hover:bg-white/30 transition-colors"
                >
                  登录发帖
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

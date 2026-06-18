import { Link } from 'react-router-dom';
import { 
  User, 
  Shield, 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare, 
  Heart,
  Settings,
  ChevronRight,
  Edit,
  Award,
  TrendingUp,
  Clock,
  Users,
  Home,
  FileText
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function Profile() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">请先登录</p>
          <Link to="/login" className="text-primary-600 hover:underline">
            去登录
          </Link>
        </div>
      </div>
    );
  }

  const getCreditLevel = (score: number) => {
    if (score >= 95) return { label: '优秀', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 85) return { label: '良好', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { label: '合格', color: 'text-amber-600', bg: 'bg-amber-100' };
    if (score >= 60) return { label: '偏低', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: '危险', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const creditLevel = getCreditLevel(currentUser.creditScore);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: '我的房源', desc: `${currentUser.hostingCount} 处房源`, path: '/my-listings', color: 'text-primary-500', bg: 'bg-primary-50' },
    { icon: <Calendar className="w-5 h-5" />, label: '我的预订', desc: '查看预订记录', path: '/bookings', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: <Star className="w-5 h-5" />, label: '我的评价', desc: '查看收到的评价', path: '/reviews', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: <MessageSquare className="w-5 h-5" />, label: '我的消息', desc: '站内信通知', path: '/messages', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: <Heart className="w-5 h-5" />, label: '我的收藏', desc: '收藏的房源和帖子', path: '/favorites', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: <FileText className="w-5 h-5" />, label: '我的帖子', desc: '发布的论坛帖子', path: '/my-posts', color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const settingsItems = [
    { icon: <Shield className="w-5 h-5" />, label: '实名认证', desc: currentUser.isVerified ? '已认证' : '去认证', path: '/profile/verify', badge: currentUser.isVerified ? 'success' : 'warning' },
    { icon: <Settings className="w-5 h-5" />, label: '账号设置', desc: '修改密码、绑定手机', path: '/profile/settings' },
    { icon: <TrendingUp className="w-5 h-5" />, label: '积分中心', desc: `${currentUser.points} 积分`, path: '/points' },
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Profile Header */}
      <div className="relative bg-gradient-to-r from-secondary-600 via-secondary-500 to-primary-500 pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.nickname}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-white/30 shadow-2xl"
                />
                <button className="absolute bottom-0 right-0 w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{currentUser.nickname}</h1>
                  {currentUser.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                      <Shield className="w-3.5 h-3.5" />
                      实名认证
                    </span>
                  )}
                </div>
                
                {currentUser.bio && (
                  <p className="text-white/80 mb-3 max-w-md">{currentUser.bio}</p>
                )}
                
                <div className="flex items-center justify-center md:justify-start gap-4 text-white/70 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {currentUser.location || '未设置'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    换宿 {currentUser.travelCount} 次
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${creditLevel.bg} mb-3`}>
              <Award className={`w-6 h-6 ${creditLevel.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentUser.creditScore}</p>
            <p className="text-sm text-gray-500">信用分 · {creditLevel.label}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 mb-3">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentUser.hostingCount}</p>
            <p className="text-sm text-gray-500">接待次数</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 mb-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentUser.travelCount}</p>
            <p className="text-sm text-gray-500">出行次数</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 mb-3">
              <Clock className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentUser.points}</p>
            <p className="text-sm text-gray-500">积分</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">常用功能</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">最近动态</h2>
                <Link to="#" className="text-sm text-primary-600 hover:text-primary-700">
                  查看全部
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { type: 'review', text: '收到了一条新的好评', time: '2小时前', icon: <Star className="w-4 h-4" />, color: 'text-amber-500' },
                    { type: 'booking', text: '您的北京四合院收到了新的入住申请', time: '昨天', icon: <Calendar className="w-4 h-4" />, color: 'text-blue-500' },
                    { type: 'points', text: '完成每日签到，获得5积分', time: '2天前', icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-500' },
                    { type: 'post', text: '您的帖子获得了128个点赞', time: '3天前', icon: <Heart className="w-4 h-4" />, color: 'text-red-500' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 bg-gray-50 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{activity.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">设置</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {settingsItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                      <p className={`text-xs ${
                        item.badge === 'success' ? 'text-green-600' : 
                        item.badge === 'warning' ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Credit Score Details */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">信用分详情</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{currentUser.creditScore}</p>
                    <p className={`text-sm ${creditLevel.color}`}>信用{creditLevel.label}</p>
                  </div>
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${currentUser.creditScore * 2.26} 226`}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FF6B35" />
                          <stop offset="100%" stopColor="#FFD166" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary-500" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">基础分</span>
                      <span className="font-medium text-gray-900">80</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">实名认证</span>
                      <span className="font-medium text-green-600">+10</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">好评加分</span>
                      <span className="font-medium text-green-600">+24</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">其他扣减</span>
                      <span className="font-medium text-red-500">-22</span>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/profile/credit"
                  className="block w-full mt-6 py-2.5 text-center text-sm text-primary-600 font-medium bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  查看信用分详情
                </Link>
              </div>
            </div>

            {/* Quick Publish */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">发布你的房源</h3>
              <p className="text-sm text-white/80 mb-4">
                用空余房间换取世界各地的免费住宿
              </p>
              <Link 
                to="/my-listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
              >
                立即发布
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

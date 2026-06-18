import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  User, 
  LogIn,
  Menu,
  X,
  Shield,
  MapPin,
  Bell
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isLoggedIn, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl flex items-center justify-center shadow-md">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">换宿家</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">首页</span>
            </Link>
            <Link 
              to="/search" 
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">搜索房源</span>
            </Link>
            <Link 
              to="/forum" 
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">社区论坛</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/my-listings/new" 
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-500 transition-all shadow-md hover:shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>发布房源</span>
                </Link>

                <Link to="/messages" className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>

                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src={currentUser?.avatar} 
                      alt="头像" 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card border border-gray-100 py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img 
                            src={currentUser?.avatar} 
                            alt="头像" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.nickname}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {currentUser?.isVerified ? (
                                <span className="flex items-center gap-0.5 text-xs text-green-600">
                                  <Shield className="w-3 h-3" />
                                  已认证
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                  <Shield className="w-3 h-3" />
                                  未认证
                                </span>
                              )}
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-primary-600 font-medium">{currentUser?.creditScore}分</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4" />
                          个人中心
                        </Link>
                        <Link 
                          to="/my-listings" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <MapPin className="w-4 h-4" />
                          我的房源
                        </Link>
                        <Link 
                          to="/bookings" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <PlusCircle className="w-4 h-4" />
                          我的预订
                        </Link>
                        <Link 
                          to="/points" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <MessageSquare className="w-4 h-4" />
                          积分中心
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogIn className="w-4 h-4 rotate-180" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-500 transition-all shadow-md"
                >
                  注册
                </Link>
              </div>
            )}

            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="container mx-auto px-4 py-2">
            <Link to="/" className="block py-3 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>首页</Link>
            <Link to="/search" className="block py-3 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>搜索房源</Link>
            <Link to="/forum" className="block py-3 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>社区论坛</Link>
            {isLoggedIn && (
              <>
                <Link to="/my-listings/new" className="block py-3 text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>+ 发布房源</Link>
                <Link to="/profile" className="block py-3 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>个人中心</Link>
                <Link to="/messages" className="block py-3 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>消息</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

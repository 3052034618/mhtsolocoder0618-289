import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText,
  AlertTriangle,
  Shield,
  TrendingUp,
  ChevronRight,
  Check,
  X,
  Eye,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { mockUsers, mockListings } from '@/services/mock/data';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { key: 'dashboard', label: '数据概览', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'users', label: '用户管理', icon: <Users className="w-5 h-5" /> },
    { key: 'listings', label: '房源审核', icon: <Home className="w-5 h-5" /> },
    { key: 'disputes', label: '争议处理', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  const pendingListings = mockListings.filter(l => l.status === 'pending');
  const pendingVerifications = mockUsers.filter(u => u.verifyStatus === 'pending');

  const stats = [
    { label: '总用户数', value: '12,580', change: '+125', icon: <Users className="w-6 h-6" />, color: 'bg-blue-50 text-blue-500' },
    { label: '总房源数', value: '3,420', change: '+48', icon: <Home className="w-6 h-6" />, color: 'bg-green-50 text-green-500' },
    { label: '待审核房源', value: pendingListings.length.toString(), change: '+5', icon: <FileText className="w-6 h-6" />, color: 'bg-amber-50 text-amber-500' },
    { label: '待处理争议', value: '3', change: '-1', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-red-50 text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-600 to-secondary-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">换宿家</h1>
              <p className="text-xs text-gray-500">管理后台</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.key
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="font-medium">返回前台</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {menuItems.find(i => i.key === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src={mockUsers[5].avatar} 
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">管理员</p>
                  <p className="text-xs text-gray-500">admin@huansujia.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                      <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Listings */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">待审核房源</h3>
                    <button 
                      onClick={() => setActiveTab('listings')}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      查看全部
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {pendingListings.slice(0, 5).map((listing) => (
                      <div key={listing.id} className="px-6 py-4 flex items-center gap-4">
                        <img 
                          src={listing.coverPhoto} 
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
                          <p className="text-xs text-gray-500">{listing.city}</p>
                        </div>
                        <span className="badge-warning">待审核</span>
                      </div>
                    ))}
                    {pendingListings.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-400 text-sm">
                        暂无待审核房源
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending Verifications */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">待认证用户</h3>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      查看全部
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {pendingVerifications.slice(0, 5).map((user) => (
                      <div key={user.id} className="px-6 py-4 flex items-center gap-4">
                        <img 
                          src={user.avatar} 
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{user.nickname}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className="badge-warning">待认证</span>
                      </div>
                    ))}
                    {pendingVerifications.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-400 text-sm">
                        暂无待认证用户
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">用户列表</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">用户</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">信用分</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">注册时间</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockUsers.slice(0, 5).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.nickname}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <span className="badge-success">已认证</span>
                        ) : user.verifyStatus === 'pending' ? (
                          <span className="badge-warning">待认证</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-medium">未认证</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{user.creditScore}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.status === 'active' ? (
                            <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <XCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Listings */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm p-1 inline-flex">
                {[
                  { key: 'pending', label: '待审核', count: pendingListings.length },
                  { key: 'approved', label: '已通过', count: mockListings.filter(l => l.status === 'active').length },
                  { key: 'rejected', label: '已拒绝', count: mockListings.filter(l => l.status === 'rejected').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className="px-6 py-2 rounded-xl font-medium text-sm transition-all bg-primary-500 text-white shadow-md"
                  >
                    {tab.label}
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pending List */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {pendingListings.map((listing) => {
                    const host = mockUsers.find(u => u.id === listing.hostId);
                    return (
                      <div key={listing.id} className="p-6">
                        <div className="flex gap-6">
                          <img 
                            src={listing.coverPhoto} 
                            alt=""
                            className="w-32 h-24 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">{listing.title}</h4>
                            <p className="text-sm text-gray-500 mb-3">{listing.city} · {listing.district}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span>{listing.bedrooms}卧</span>
                              <span>{listing.bathrooms}卫</span>
                              <span>可住{listing.maxGuests}人</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <img 
                                src={host?.avatar} 
                                alt=""
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600">{host?.nickname}</span>
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(listing.createdAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center gap-2">
                            <button className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1">
                              <Check className="w-4 h-4" />
                              通过
                            </button>
                            <button className="px-4 py-2 bg-red-50 text-red-500 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1">
                              <X className="w-4 h-4" />
                              拒绝
                            </button>
                            <button className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              查看
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {pendingListings.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无待审核房源</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Disputes */}
          {activeTab === 'disputes' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">争议处理</h3>
              </div>
              <div className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">暂无待处理争议</h4>
                <p className="text-gray-500">所有争议都已处理完毕</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

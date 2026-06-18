import { useState } from 'react';
import { 
  Coins, 
  Gift, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ShoppingBag,
  Clock,
  Award,
  Zap,
  Home,
  MessageSquare,
  FileText,
  CheckCircle
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { mockExchangeItems } from '@/services/mock/data';

export default function Points() {
  const { currentUser, pointRecords, addPoints, spendPoints } = useAppStore();
  const [activeTab, setActiveTab] = useState<'records' | 'exchange'>('records');
  const [showExchangeSuccess, setShowExchangeSuccess] = useState(false);
  const [exchangeItemName, setExchangeItemName] = useState('');

  const myPointRecords = currentUser 
    ? pointRecords.filter(r => r.userId === currentUser.id)
    : [];

  const handleSignIn = () => {
    addPoints(5, '每日签到', 'signin');
    alert('签到成功！获得5积分');
  };

  const handleExchange = (item: typeof mockExchangeItems[0]) => {
    if (!currentUser || currentUser.points < item.points) {
      return;
    }
    
    const success = spendPoints(item.points, `兑换：${item.name}`);
    if (success) {
      setExchangeItemName(item.name);
      setShowExchangeSuccess(true);
      setTimeout(() => setShowExchangeSuccess(false), 3000);
    }
  };

  const getPointsSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      signin: '每日签到',
      verify: '实名认证',
      listing: '发布房源',
      review: '发表评价',
      post: '发布帖子',
      like: '帖子被点赞',
      invite: '邀请好友',
      exchange: '积分兑换',
      other: '其他',
    };
    return labels[source] || '其他';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const waysToEarn = [
    { icon: <Award className="w-6 h-6" />, title: '完成实名认证', points: '+100', desc: '通过实名认证获得', bg: 'bg-blue-50', color: 'text-blue-500' },
    { icon: <Home className="w-6 h-6" />, title: '发布房源', points: '+200', desc: '房源通过审核获得', bg: 'bg-green-50', color: 'text-green-500' },
    { icon: <MessageSquare className="w-6 h-6" />, title: '发表评价', points: '+50', desc: '每次评价获得', bg: 'bg-purple-50', color: 'text-purple-500' },
    { icon: <FileText className="w-6 h-6" />, title: '发布帖子', points: '+20', desc: '每篇优质帖子获得', bg: 'bg-amber-50', color: 'text-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-warm-50 relative">
      {/* Success Toast */}
      {showExchangeSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">成功兑换：{exchangeItemName}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 text-white pt-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">积分中心</h1>
            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              积分规则
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">我的积分</p>
                <div className="flex items-end gap-2">
                  <Coins className="w-10 h-10 text-yellow-200" />
                  <span className="text-5xl font-bold">{currentUser?.points || 0}</span>
                </div>
              </div>
              <button
                onClick={handleSignIn}
                className="px-6 py-3 bg-white text-amber-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  每日签到
                </div>
                <span className="text-xs opacity-70">+5积分</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-white/70">今日已得</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-white/70">本月已得</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-white/70">连续签到</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'records' 
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              积分明细
            </button>
            <button
              onClick={() => setActiveTab('exchange')}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'exchange' 
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Gift className="w-4 h-4 inline mr-2" />
              兑换商城
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'records' ? (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">积分记录</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {myPointRecords.length > 0 ? (
                    myPointRecords.map((record) => (
                      <div key={record.id} className="flex items-center gap-4 px-6 py-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.type === 'earn' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          {record.type === 'earn' 
                            ? <TrendingUp className="w-5 h-5 text-green-500" />
                            : <TrendingDown className="w-5 h-5 text-red-500" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{record.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{getPointsSourceLabel(record.source)}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(record.createdAt)}
                            </span>
                          </div>
                        </div>
                        <span className={`text-lg font-bold ${
                          record.type === 'earn' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {record.type === 'earn' ? '+' : '-'}{record.points}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-16 text-center text-gray-400">
                      <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>暂无积分记录</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">兑换商品</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {mockExchangeItems.map((item) => (
                    <div 
                      key={item.id}
                      className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-card transition-all"
                    >
                      <div className="aspect-video bg-gray-50 relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.isHot && (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            热门
                          </span>
                        )}
                        {item.stock !== undefined && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                            库存 {item.stock}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-amber-500" />
                            <span className="font-bold text-amber-600">{item.points}</span>
                          </div>
                          <button
                            onClick={() => handleExchange(item)}
                            disabled={(currentUser?.points || 0) < item.points}
                            className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {(currentUser?.points || 0) < item.points ? '积分不足' : '立即兑换'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ways to Earn */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-500" />
                  获取积分
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {waysToEarn.map((way, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <div className={`w-10 h-10 ${way.bg} ${way.color} rounded-lg flex items-center justify-center`}>
                      {way.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{way.title}</p>
                      <p className="text-xs text-gray-500">{way.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-green-500">{way.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">当前等级</h3>
                  <p className="text-sm text-white/70">银卡会员</p>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>距离金卡还需</span>
                  <span className="font-medium">2,420 积分</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                    style={{ width: '35%' }}
                  />
                </div>
              </div>
              
              <p className="text-xs text-white/70 mt-3">
                升级金卡可享受：房源推荐优先、专属客服、积分加速等权益
              </p>
            </div>

            {/* Exchange History */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary-500" />
                  兑换记录
                </h3>
              </div>
              <div className="p-4">
                <div className="text-center py-8 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无兑换记录</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

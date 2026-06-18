import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, ChevronLeft, Check, AlertCircle, MapPin } from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function Verify() {
  const navigate = useNavigate();
  const { currentUser, submitIdentityVerify, submitAddressVerify } = useAppStore();
  const [activeTab, setActiveTab] = useState<'identity' | 'address'>('identity');
  const [realName, setRealName] = useState(currentUser?.realName || '');
  const [idCard, setIdCard] = useState(currentUser?.idCard || '');
  const [addressProof, setAddressProof] = useState(currentUser?.addressProof || '');
  const [error, setError] = useState('');

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

  const handleIdentitySubmit = () => {
    setError('');
    
    if (!realName.trim()) {
      setError('请输入真实姓名');
      return;
    }
    if (!idCard.trim() || idCard.length < 15) {
      setError('请输入有效的身份证号');
      return;
    }
    
    submitIdentityVerify(realName.trim(), idCard.trim());
    alert('实名认证申请已提交，请等待平台审核');
    navigate('/profile');
  };

  const handleAddressSubmit = () => {
    setError('');
    
    if (!addressProof.trim()) {
      setError('请上传地址证明材料描述');
      return;
    }
    
    submitAddressVerify(addressProof.trim());
    alert('地址核验申请已提交，请等待平台审核');
    navigate('/profile');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return { text: '已通过', color: 'text-green-600', bg: 'bg-green-100' };
      case 'pending':
        return { text: '审核中', color: 'text-amber-600', bg: 'bg-amber-100' };
      case 'rejected':
        return { text: '已拒绝', color: 'text-red-600', bg: 'bg-red-100' };
      default:
        return { text: '未认证', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const identityStatus = getStatusText(currentUser.verifyStatus);
  const addressStatus = getStatusText(currentUser.addressVerifyStatus);

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">认证中心</h1>
              <p className="text-sm text-gray-500">完成认证，提升信用分和可信度</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-card p-1 mb-6 inline-flex w-full">
            <button
              onClick={() => { setActiveTab('identity'); setError(''); }}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'identity'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              实名认证
            </button>
            <button
              onClick={() => { setActiveTab('address'); setError(''); }}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'address'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              地址核验
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Identity Verify */}
          {activeTab === 'identity' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">实名认证</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${identityStatus.bg} ${identityStatus.color}`}>
                  {currentUser.verifyStatus === 'approved' && <Check className="w-3.5 h-3.5" />}
                  {identityStatus.text}
                </span>
              </div>

              {currentUser.verifyStatus === 'approved' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">实名认证已通过</h3>
                  <p className="text-gray-500 mb-2">您的身份信息已通过平台审核</p>
                  <p className="text-sm text-green-600">+10 信用分</p>
                </div>
              ) : currentUser.verifyStatus === 'pending' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">审核中</h3>
                  <p className="text-gray-500">您的实名认证申请正在审核中，请耐心等待</p>
                  <p className="text-sm text-gray-400 mt-3">审核通常在 1-3 个工作日内完成</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-6">
                    完成实名认证后，您的信用分将增加 10 分，并获得"已认证"标识，更容易获得房东的信任。
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="input-label">真实姓名 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                        placeholder="请输入您的真实姓名"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="input-label">身份证号 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={idCard}
                        onChange={(e) => setIdCard(e.target.value)}
                        placeholder="请输入您的身份证号"
                        className="input-field"
                        maxLength={18}
                      />
                    </div>

                    <div>
                      <label className="input-label">上传身份证照片</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm">身份证正面</span>
                        </div>
                        <div className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-sm">身份证反面</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">* 演示版本，实际应用中需要上传真实照片</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-blue-800 mb-2">🔒 隐私保护</h4>
                    <ul className="text-sm text-blue-700/80 space-y-1">
                      <li>• 您的身份信息仅用于平台审核，不会泄露给第三方</li>
                      <li>• 只有经过您确认的预订用户才能看到您的姓名</li>
                      <li>• 平台采用银行级加密保护您的个人信息</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleIdentitySubmit}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交认证申请
                  </button>
                </>
              )}
            </div>
          )}

          {/* Address Verify */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">地址核验</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${addressStatus.bg} ${addressStatus.color}`}>
                  {currentUser.addressVerifyStatus === 'approved' && <Check className="w-3.5 h-3.5" />}
                  {addressStatus.text}
                </span>
              </div>

              {currentUser.addressVerifyStatus === 'approved' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">地址核验已通过</h3>
                  <p className="text-gray-500 mb-2">您的地址信息已通过平台审核</p>
                  <p className="text-sm text-green-600">+5 信用分</p>
                </div>
              ) : currentUser.addressVerifyStatus === 'pending' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">审核中</h3>
                  <p className="text-gray-500">您的地址核验申请正在审核中，请耐心等待</p>
                  <p className="text-sm text-gray-400 mt-3">审核通常在 1-3 个工作日内完成</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-6">
                    完成地址核验后，您的信用分将增加 5 分，房源可信度更高。
                    可接受的地址证明包括：房产证、租房合同、水电费账单等。
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="input-label">现居住地址 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={currentUser?.location || ''}
                        placeholder="请输入您的详细地址"
                        className="input-field"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="input-label">地址证明材料描述 <span className="text-red-500">*</span></label>
                      <textarea
                        value={addressProof}
                        onChange={(e) => setAddressProof(e.target.value)}
                        placeholder="请描述您提供的地址证明材料类型（如：房产证、租房合同、水电费账单等）"
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>

                    <div>
                      <label className="input-label">上传证明材料</label>
                      <div className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 mb-2" />
                        <span className="text-sm">点击上传证明材料照片</span>
                        <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式，最多3张</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">* 演示版本，实际应用中需要上传真实照片</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                    <h4 className="font-medium text-amber-800 mb-2">📋 可接受的证明材料</h4>
                    <ul className="text-sm text-amber-700/80 space-y-1">
                      <li>• 房屋产权证或购房合同</li>
                      <li>• 房屋租赁合同（需含双方签字）</li>
                      <li>• 近3个月内的水电费、燃气费账单</li>
                      <li>• 近3个月内的银行对账单（需显示地址）</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleAddressSubmit}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交核验申请
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

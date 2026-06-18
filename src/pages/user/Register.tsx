import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Mail, Lock, Eye, EyeOff, User, Phone, Shield, Check } from 'lucide-react';
import useAppStore from '@/store/useAppStore';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    verifyCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { register } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const passwordStrength = () => {
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    return score;
  };

  const strengthLabels = ['弱', '较弱', '中等', '较强', '强'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">换宿家</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">创建账号</h1>
          <p className="text-gray-500">加入换宿社区，开启免费换宿之旅</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-gray-700' : 'text-gray-400'}`}>
                {s === 1 ? '基本信息' : '完善资料'}
              </span>
              {s < 2 && <div className={`w-8 h-0.5 ${step > 1 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="input-label">手机号</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="请输入手机号"
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="请输入邮箱"
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateForm('password', e.target.value)}
                      placeholder="请设置密码"
                      className="input-field pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i < passwordStrength() 
                                ? strengthColors[passwordStrength() - 1]
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        密码强度：{strengthLabels[passwordStrength() - 1] || '请输入密码'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="input-label">确认密码</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateForm('confirmPassword', e.target.value)}
                      placeholder="请再次输入密码"
                      className="input-field pl-12"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="input-label">昵称</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => updateForm('nickname', e.target.value)}
                      placeholder="给自己取个昵称吧"
                      className="input-field pl-12"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">为什么需要实名认证？</h4>
                      <p className="text-sm text-green-700/80">
                        为了保障换宿安全，所有会员都需要完成实名认证。
                        认证后你的信用分会增加，房源排序也会更靠前。
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  你可以先跳过实名认证，稍后在个人中心完成。
                </p>
              </>
            )}

            {step === 1 && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-300"
                />
                <span className="text-sm text-gray-600">
                  我已阅读并同意
                  <a href="#" className="text-primary-600 hover:underline">《用户协议》</a>
                  和
                  <a href="#" className="text-primary-600 hover:underline">《隐私政策》</a>
                </span>
              </label>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  上一步
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || (step === 1 && !agreed)}
                className="flex-1 py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? '注册中...' : step === 1 ? '下一步' : '完成注册'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            已有账号？
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 ml-1">
              去登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

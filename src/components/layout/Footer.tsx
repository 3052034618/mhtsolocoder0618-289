import { Link } from 'react-router-dom';
import { Home, Shield, MessageSquare, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-500 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">换宿家</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              一个让全球旅行者免费交换短期住宿的互助社区。用你的空余房间，换取世界各地的免费住宿体验。
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">搜索房源</Link></li>
              <li><Link to="/forum" className="hover:text-white transition-colors">社区论坛</Link></li>
              <li><Link to="/my-listings/new" className="hover:text-white transition-colors">发布房源</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">帮助中心</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="#" className="hover:text-white transition-colors">新手指南</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">换宿规则</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">安全保障</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">常见问题</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@huansujia.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>400-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>北京市朝阳区XXX大厦</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © 2024 换宿家 Huansujia. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <Link to="#" className="hover:text-white/70 transition-colors">用户协议</Link>
            <Link to="#" className="hover:text-white/70 transition-colors">隐私政策</Link>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>安全认证</span>
            </div>
          </div>
        </div>

        <div className="mt-6 py-4 bg-white/10 rounded-xl flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-400" />
            <span className="text-white/80">实名认证保障</span>
          </div>
          <div className="hidden md:block w-px h-5 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent-400" />
            <span className="text-white/80">站内信沟通</span>
          </div>
          <div className="hidden md:block w-px h-5 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent-400" />
            <span className="text-white/80">互助社区</span>
          </div>
          <div className="hidden md:block w-px h-5 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-400" />
            <span className="text-white/80">争议调解</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Star, 
  ArrowLeft,
  Send,
  User,
  Home,
  ThumbsUp
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { REVIEW_TAGS_HOST, REVIEW_TAGS_GUEST } from '@/types';

export default function ReviewPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { 
    currentUser, 
    getBookingById, 
    getListingById, 
    users,
    addReview 
  } = useAppStore();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const booking = bookingId ? getBookingById(bookingId) : undefined;
  const listing = booking ? getListingById(booking.listingId) : undefined;
  const reviewee = booking && currentUser
    ? users.find(u => u.id === (booking.guestId === currentUser.id ? booking.hostId : booking.guestId))
    : undefined;
  
  const isHostReview = booking && currentUser
    ? booking.guestId === currentUser.id
    : false;
  
  const tags = isHostReview ? REVIEW_TAGS_HOST : REVIEW_TAGS_GUEST;
  
  useEffect(() => {
    if (!booking || !currentUser) return;
    if (booking.status !== 'completed') {
      navigate('/bookings');
    }
  }, [booking, currentUser, navigate]);
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSubmit = () => {
    if (!booking || !currentUser || rating === 0) return;
    
    setSubmitting(true);
    
    addReview({
      bookingId: booking.id,
      reviewerId: currentUser.id,
      revieweeId: isHostReview ? booking.hostId : booking.guestId,
      listingId: booking.listingId,
      rating,
      content,
      tags: selectedTags,
      isHostReview,
    });
    
    setTimeout(() => {
      setSubmitting(false);
      navigate('/bookings');
    }, 500);
  };
  
  if (!booking || !listing || !reviewee) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">
          加载中...
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>
      
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isHostReview ? '评价房东' : '评价房客'}
          </h1>
          <p className="text-gray-500 mb-6">
            您的评价将帮助其他用户做出更好的选择
          </p>
          
          {/* Info Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-8">
            <img 
              src={reviewee.avatar} 
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{reviewee.nickname}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isHostReview ? (
                  <>
                    <Home className="w-4 h-4" />
                    <span>{listing.title}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>入住 {booking.guests} 人</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">整体评分</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-medium text-gray-600">
                {rating > 0 ? (
                  rating === 5 ? '非常满意' :
                  rating === 4 ? '比较满意' :
                  rating === 3 ? '一般' :
                  rating === 2 ? '不太满意' :
                  '非常不满意'
                ) : '请点击评分'}
              </span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">选择标签</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">写下你的评价</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的真实体验，帮助其他用户做出更好的选择..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {content.length} / 500
            </p>
          </div>
          
          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {submitting ? '提交中...' : '提交评价'}
          </button>
          
          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex gap-3">
              <ThumbsUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">评价小贴士</p>
                <ul className="space-y-1 text-blue-600">
                  <li>• 真实客观的评价对其他用户最有帮助</li>
                  <li>• 完成评价可获得 5 积分奖励</li>
                  <li>• 评价将在双方都完成后公开显示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

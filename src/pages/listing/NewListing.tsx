import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  Home, 
  Users, 
  Bed, 
  Bath,
  X,
  Plus,
  Image as ImageIcon,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { AMENITIES_LIST, PROPERTY_TYPES, type Listing } from '@/types';

export default function NewListing() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { addListing, currentUser } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    district: '',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    beds: 1,
    amenities: [] as string[],
    houseRules: [] as string[],
    newRule: '',
    highlights: [] as string[],
    newHighlight: '',
  });

  const [photos, setPhotos] = useState<string[]>([]);

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addRule = () => {
    if (formData.newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, prev.newRule.trim()],
        newRule: ''
      }));
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = () => {
    if (formData.newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, prev.newHighlight.trim()],
        newHighlight: ''
      }));
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addPhoto = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
    ];
    const newPhoto = mockPhotos[photos.length % mockPhotos.length];
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      hostId: currentUser?.id || '',
      title: formData.title,
      description: formData.description,
      city: formData.city,
      address: formData.address,
      district: formData.district,
      propertyType: formData.propertyType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      maxGuests: formData.maxGuests,
      beds: formData.beds,
      amenities: formData.amenities,
      houseRules: formData.houseRules,
      photos: photos.map((url, i) => ({
        id: `photo-${i}`,
        listingId: '',
        url,
        isCover: i === 0,
        order: i,
      })),
      coverPhoto: photos[0],
      status: 'pending',
      avgRating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      isFree: true,
      highlights: formData.highlights,
    };
    
    addListing(newListing);
    alert('房源发布成功，等待平台审核！');
    navigate('/my-listings');
  };

  const steps = [
    { number: 1, title: '基本信息', icon: <MapPin className="w-5 h-5" /> },
    { number: 2, title: '房屋设施', icon: <Home className="w-5 h-5" /> },
    { number: 3, title: '照片上传', icon: <ImageIcon className="w-5 h-5" /> },
    { number: 4, title: '规则设置', icon: <Check className="w-5 h-5" /> },
  ];

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.city && formData.address && formData.propertyType;
      case 2:
        return formData.amenities.length > 0;
      case 3:
        return photos.length > 0;
      case 4:
        return formData.houseRules.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">发布房源</h1>
              <p className="text-sm text-gray-500">完成以下步骤，发布你的房源</p>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between mt-6 max-w-2xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= s.number 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.number ? <Check className="w-5 h-5" /> : s.icon}
                  </div>
                  <span className={`text-xs mt-2 ${step >= s.number ? 'text-gray-700' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 md:w-24 h-0.5 mx-2 -mt-6 ${
                    step > s.number ? 'bg-primary-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-card p-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
                
                <div>
                  <label className="input-label">房源标题 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="给自己的房源取个吸引人的标题"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">城市 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      placeholder="如：北京"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">行政区</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => updateForm('district', e.target.value)}
                      placeholder="如：朝阳区"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">详细地址 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="请输入详细地址"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-400 mt-1">地址仅对已确认预订的客人可见</p>
                </div>

                <div>
                  <label className="input-label">房屋类型 <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => updateForm('propertyType', type.id)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.propertyType === type.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">卧室</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateForm('bedrooms', Math.max(1, formData.bedrooms - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{formData.bedrooms}</span>
                      <button 
                        onClick={() => updateForm('bedrooms', formData.bedrooms + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="input-label">卫生间</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateForm('bathrooms', Math.max(1, formData.bathrooms - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{formData.bathrooms}</span>
                      <button 
                        onClick={() => updateForm('bathrooms', formData.bathrooms + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="input-label">可住人数</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateForm('maxGuests', Math.max(1, formData.maxGuests - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{formData.maxGuests}</span>
                      <button 
                        onClick={() => updateForm('maxGuests', formData.maxGuests + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="input-label">房源描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="详细描述你的房源，让客人更好地了解它"
                    rows={5}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="input-label">房源亮点</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.highlights.map((h, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
                      >
                        {h}
                        <button onClick={() => removeHighlight(i)} className="hover:text-primary-800">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newHighlight}
                      onChange={(e) => updateForm('newHighlight', e.target.value)}
                      placeholder="添加房源亮点"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    />
                    <button 
                      onClick={addHighlight}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Amenities */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">房屋设施</h2>
                <p className="text-sm text-gray-500 mb-4">选择你的房源提供的设施（至少选择一项）</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {AMENITIES_LIST.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.amenities.includes(amenity.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                        formData.amenities.includes(amenity.id)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {amenity.name === 'WiFi' && <span className="text-xs font-bold">WiFi</span>}
                        {amenity.name !== 'WiFi' && <span className="text-lg">🏠</span>}
                      </div>
                      <span className={`text-sm font-medium ${
                        formData.amenities.includes(amenity.id)
                          ? 'text-primary-700'
                          : 'text-gray-700'
                      }`}>
                        {amenity.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">上传照片</h2>
                <p className="text-sm text-gray-500 mb-6">上传真实的房源照片，至少需要1张</p>
                
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img 
                        src={photo} 
                        alt={`照片${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(index)}
                          className="p-2 bg-white rounded-full text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                          封面
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {photos.length < 9 && (
                    <button
                      onClick={addPhoto}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
                    >
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm">添加照片</span>
                    </button>
                  )}
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">💡 拍照小技巧</h4>
                  <ul className="text-sm text-blue-700/80 space-y-1">
                    <li>• 确保房间整洁，光线充足</li>
                    <li>• 多角度展示房间布局</li>
                    <li>• 突出房源的特色和亮点</li>
                    <li>• 照片越真实，预订率越高</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: House Rules */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">生活规则</h2>
                <p className="text-sm text-gray-500 mb-6">设置入住规则，让客人知道注意事项</p>
                
                <div>
                  <label className="input-label">常见规则（可多选）</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['禁止吸烟', '禁止宠物', '禁止派对', '晚上10点后保持安静', '请爱护家具', '禁止穿鞋进屋', '按时退房'].map((rule) => (
                      <button
                        key={rule}
                        onClick={() => {
                          if (formData.houseRules.includes(rule)) {
                            removeRule(formData.houseRules.indexOf(rule));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              houseRules: [...prev.houseRules, rule]
                            }));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.houseRules.includes(rule)
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {rule}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">自定义规则</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={formData.newRule}
                      onChange={(e) => updateForm('newRule', e.target.value)}
                      placeholder="添加自定义规则"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                    />
                    <button 
                      onClick={addRule}
                      className="px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  
                  {formData.houseRules.length > 0 && (
                    <div className="space-y-2">
                      {formData.houseRules.map((rule, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">{rule}</span>
                          <button 
                            onClick={() => removeRule(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <h4 className="font-medium text-green-800 mb-2">🎉 准备发布</h4>
                  <p className="text-sm text-green-700/80 mb-3">
                    确认所有信息无误后，就可以发布你的房源了。
                    发布后需要等待平台审核，审核通过后房源将自动上线。
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Check className="w-4 h-4" />
                    <span>免费换宿，无需付费</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                上一步
              </button>
              
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  下一步
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发布房源
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

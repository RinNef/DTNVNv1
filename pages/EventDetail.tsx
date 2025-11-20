
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppContext';
import { ArrowLeft, Calendar, MapPin, Users, Check, Share2, X } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, registerForEvent } = useAppStore();
  const navigate = useNavigate();
  
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sự kiện</h2>
        <button onClick={() => navigate('/events')} className="text-youth-blue hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.maxParticipants;
  const percentFull = Math.min(100, (event.registeredCount / event.maxParticipants) * 100);

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.phone) return;

    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
      registerForEvent(event.id, registerForm);
      setIsSubmitting(false);
      setShowRegisterModal(false);
      setRegisterForm({ name: '', phone: '' });
      alert("Đăng ký tham gia thành công! Ban tổ chức sẽ liên hệ với bạn.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 relative">
      {/* Banner */}
      <div className="relative h-64 md:h-96 w-full">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <button 
            onClick={() => navigate('/events')}
            className="text-white/80 hover:text-white flex items-center mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
          </button>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/90 text-sm md:text-base">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Calendar size={16} className="mr-2" /> {event.date}
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <MapPin size={16} className="mr-2" /> {event.location}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="prose prose-blue max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-youth-blue pl-3">Nội dung chương trình</h3>
              <p className="text-gray-600 font-medium text-lg mb-6 leading-relaxed italic">
                {event.description}
              </p>
              
              {event.content ? (
                 <div className="whitespace-pre-line text-gray-800 leading-relaxed space-y-4">
                   {/* Simple Markdown rendering replacement for demo */}
                   {event.content.split('\n').map((line, idx) => {
                     if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold text-blue-800 mt-6 mb-2">{line.replace('### ', '')}</h3>;
                     if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.replace('## ', '')}</h2>;
                     if (line.startsWith('- ') || line.startsWith('* ')) return <li key={idx} className="ml-4 list-disc">{line.substring(2)}</li>;
                     if (line.startsWith('1. ')) return <li key={idx} className="ml-4 list-decimal">{line.substring(3)}</li>;
                     if (line.match(/^\d+\./)) return <li key={idx} className="ml-4 list-decimal">{line}</li>;
                     if (line.startsWith('**') && line.endsWith('**')) return <strong key={idx} className="block mt-2">{line.replace(/\*\*/g, '')}</strong>;
                     return <p key={idx} className="mb-2">{line}</p>;
                   })}
                 </div>
              ) : (
                <p className="text-gray-500 italic">Chưa có nội dung chi tiết cho hoạt động này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Registration Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Users size={20} className="mr-2 text-youth-blue" /> 
              Thông tin đăng ký
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Số lượng đã đăng ký</span>
                <span className="font-bold text-gray-900">{event.registeredCount}/{event.maxParticipants}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{width: `${percentFull}%`}}
                ></div>
              </div>
              {isFull && <p className="text-red-500 text-xs mt-1 font-medium">Đã đủ số lượng tham gia</p>}
            </div>

            <button
              onClick={() => setShowRegisterModal(true)}
              disabled={isFull}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium text-lg mb-4 transition-all
                ${isFull 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-youth-accent hover:bg-red-700 transform hover:-translate-y-1 shadow-md hover:shadow-lg'
                }`}
            >
              {isFull ? 'Đã hết chỗ' : 'Đăng ký tham gia ngay'}
            </button>

            <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors">
              <Share2 size={18} className="mr-2" /> Chia sẻ hoạt động
            </button>
            
            <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
              <p className="mb-2"><strong>Lưu ý:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Vui lòng đến đúng giờ tập trung.</li>
                <li>Trang phục áo Thanh Niên Việt Nam (nếu có).</li>
                <li>Mang theo nước uống cá nhân.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="p-4 bg-youth-blue text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Đăng Ký Tham Gia</h3>
              <button onClick={() => setShowRegisterModal(false)} className="hover:text-gray-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded border border-blue-100 mb-2">
                <p className="text-sm text-blue-800 font-semibold">{event.title}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar size={12} className="mr-1" /> {event.date}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                <input
                  required
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Nhập số điện thoại liên hệ"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-youth-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-3">
                  Thông tin của bạn sẽ được bảo mật và chỉ dùng để liên hệ tổ chức.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
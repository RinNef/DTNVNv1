
import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Calendar, MapPin, Users, Check, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const { events, registerForEvent } = useAppStore();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openRegisterModal = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setSelectedEventId(id);
    setRegisterForm({ name: '', phone: '' });
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !registerForm.name || !registerForm.phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      registerForEvent(selectedEventId, registerForm);
      setIsSubmitting(false);
      setSelectedEventId(null);
      setRegisterForm({ name: '', phone: '' });
      alert("Đăng ký tham gia thành công! Ban tổ chức sẽ liên hệ với bạn.");
    }, 1000);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-youth-blue sm:text-4xl">
            Hoạt Động & Phong Trào
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            "Đâu cần thanh niên có, đâu khó có thanh niên". Hãy cùng tham gia các hoạt động ý nghĩa.
          </p>
        </div>

        <div className="space-y-8">
          {events.map((event) => {
            const isFull = event.registeredCount >= event.maxParticipants;
            return (
              <Link to={`/events/${event.id}`} key={event.id} className="block bg-white rounded-lg shadow-md overflow-hidden lg:flex hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                <div className="lg:flex-shrink-0 lg:w-96 h-64 lg:h-auto relative overflow-hidden">
                  <img 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={event.imageUrl} 
                    alt={event.title} 
                  />
                  <div className="absolute top-0 right-0 bg-youth-accent text-white px-3 py-1 m-4 rounded text-sm font-bold z-10">
                    Sắp diễn ra
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <div className="p-8 w-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-sm text-blue-600 font-semibold tracking-wide uppercase">
                      <Calendar className="mr-2" size={16} />
                      {event.date}
                    </div>
                    <h3 className="mt-2 text-2xl leading-8 font-bold text-gray-900 sm:text-3xl group-hover:text-blue-700 transition-colors">
                      {event.title}
                    </h3>
                    <div className="mt-2 flex items-center text-gray-500">
                      <MapPin size={18} className="mr-2" />
                      {event.location}
                    </div>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between border-t pt-6">
                    <div className="flex items-center">
                      <Users className="text-gray-400 mr-2" size={20} />
                      <div className="flex flex-col">
                         <span className="text-sm text-gray-500">Đã đăng ký</span>
                         <span className="font-bold text-gray-900">
                           {event.registeredCount} / {event.maxParticipants}
                         </span>
                         <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                           <div 
                             className="h-full bg-blue-500 rounded-full" 
                             style={{width: `${Math.min(100, (event.registeredCount / event.maxParticipants) * 100)}%`}}
                           ></div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-youth-blue font-medium hover:bg-blue-50 rounded-md transition-colors flex items-center">
                            Chi tiết <ArrowRight size={16} className="ml-1" />
                        </button>
                        <button
                        onClick={(e) => openRegisterModal(e, event.id)}
                        disabled={isFull}
                        className={`flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
                            ${isFull 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-youth-blue hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                        {isFull ? (
                            'Đã đủ'
                        ) : (
                            <>
                            Đăng ký
                            <Check className="ml-2 -mr-1" size={20} />
                            </>
                        )}
                        </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

       {/* Registration Modal (Shared Logic) */}
       {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="p-4 bg-youth-blue text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Đăng Ký Tham Gia</h3>
              <button onClick={() => setSelectedEventId(null)} className="hover:text-gray-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded border border-blue-100 mb-2">
                <p className="text-sm text-blue-800 font-semibold">{selectedEvent.title}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar size={12} className="mr-1" /> {selectedEvent.date}
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
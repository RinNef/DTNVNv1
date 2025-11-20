
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import Library from './pages/Library';
import Admin from './pages/Admin';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import Competitions from './pages/Competitions';
import NewsDetail from './pages/NewsDetail';
import News from './pages/News';
import { MapPin, Phone, Mail, Globe, Facebook, Youtube, ArrowUp } from 'lucide-react';

const App: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/library" element={<Library />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          <footer className="bg-slate-900 text-slate-300 border-t-4 border-youth-blue">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Col 1: Brand & Identity */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
                       <img 
                         src="https://upload.wikimedia.org/wikipedia/vi/thumb/3/37/Logo_Huy_hi%E1%BB%87u_%C4%90o%C3%A0n_TNCS_H%E1%BB%93_Ch%C3%AD_Minh.svg/1200px-Logo_Huy_hi%E1%BB%87u_%C4%90o%C3%A0n_TNCS_H%E1%BB%93_Ch%C3%AD_Minh.svg.png" 
                         alt="Logo" 
                         className="w-10 h-10 object-contain"
                       />
                    </div>
                    <div>
                       <h3 className="text-white font-bold text-lg uppercase tracking-wider">Cổng Thông Tin</h3>
                       <p className="text-blue-400 font-semibold text-sm">Đoàn TNCS Hồ Chí Minh</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Diễn đàn của tuổi trẻ, nơi kết nối, chia sẻ và lan tỏa những giá trị tốt đẹp. Tiên phong trong chuyển đổi số và phong trào thanh niên tình nguyện.
                  </p>
                  <div className="flex items-center space-x-2 text-white font-medium bg-slate-800 px-3 py-2 rounded-md inline-flex border border-slate-700">
                    <Globe size={16} className="text-blue-400" />
                    <span>thanhnien.portal.vn</span>
                  </div>
                </div>

                {/* Col 2: Contact Info */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-5 uppercase border-l-4 border-blue-500 pl-3">Thông Tin Liên Hệ</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <MapPin size={20} className="mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Số 60 Nguyễn Cơ Thạch, Phường An Lợi Đông, Thành phố Thủ Đức, TP. Hồ Chí Minh.</span>
                    </li>
                     <li className="flex items-center">
                      <Phone size={20} className="mr-3 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">028 3822 xxxx - Hotline: 1900 xxxx</span>
                    </li>
                     <li className="flex items-center">
                      <Mail size={20} className="mr-3 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">vanphong@doanthanhnien.vn</span>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Socials & Links */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-5 uppercase border-l-4 border-blue-500 pl-3">Kết Nối</h3>
                  <p className="text-sm text-slate-400 mb-4">Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật tin tức nhanh nhất.</p>
                  <div className="flex space-x-4 mb-6">
                    <a href="#" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg" title="Facebook">
                      <Facebook size={20} />
                    </a>
                    <a href="#" className="bg-red-600 text-white p-2.5 rounded-full hover:bg-red-700 transition-colors shadow-lg" title="Youtube">
                      <Youtube size={20} />
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                     <Link to="/news" className="text-slate-400 hover:text-white transition-colors">Tin tức</Link>
                     <Link to="/documents" className="text-slate-400 hover:text-white transition-colors">Văn bản</Link>
                     <Link to="/events" className="text-slate-400 hover:text-white transition-colors">Hoạt động</Link>
                     <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">Đăng nhập</Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-slate-400">© 2024 Bản quyền thuộc về <span className="text-white font-medium">Đoàn TNCS Hồ Chí Minh</span>.</p>
                  <p className="text-xs text-slate-600 mt-1">Mọi hành vi sao chép đều phải ghi rõ nguồn.</p>
                </div>
                <div className="flex items-center gap-4">
                   <p className="text-xs text-slate-500">Powered by React & Gemini AI</p>
                   <button 
                    onClick={scrollToTop}
                    className="bg-slate-800 p-2 rounded hover:bg-blue-600 text-white transition-colors"
                    title="Lên đầu trang"
                   >
                     <ArrowUp size={16} />
                   </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;

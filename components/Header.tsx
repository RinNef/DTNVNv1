
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Settings, Calendar, FileText, Award } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white';

  return (
    <header className="bg-youth-blue sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                 {/* Placeholder for Logo */}
                 <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/3/37/Logo_Huy_hi%E1%BB%87u_%C4%90o%C3%A0n_TNCS_H%E1%BB%93_Ch%C3%AD_Minh.svg/1200px-Logo_Huy_hi%E1%BB%87u_%C4%90o%C3%A0n_TNCS_H%E1%BB%93_Ch%C3%AD_Minh.svg.png" alt="Logo" className="w-8 h-8" />
              </div>
              <span className="text-white font-bold text-xl tracking-wide hidden sm:block">ĐOÀN THANH NIÊN</span>
              <span className="text-white font-bold text-xl tracking-wide sm:hidden">ĐOÀN TN</span>
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${isActive('/')}`}>
                <Home size={18} /> <span>Trang chủ</span>
              </Link>
              <Link to="/events" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${isActive('/events')}`}>
                <Calendar size={18} /> <span>Hoạt động</span>
              </Link>
              <Link to="/competitions" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${isActive('/competitions')}`}>
                <Award size={18} /> <span>Thi trực tuyến</span>
              </Link>
              <Link to="/documents" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${isActive('/documents')}`}>
                <FileText size={18} /> <span>Văn bản</span>
              </Link>
              <Link to="/library" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${isActive('/library')}`}>
                <BookOpen size={18} /> <span>Thư viện</span>
              </Link>
              <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${isActive('/admin')}`}>
                <Settings size={18} /> <span>Quản trị</span>
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-blue-800 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Trang chủ</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Hoạt động</Link>
            <Link to="/competitions" onClick={() => setIsOpen(false)} className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Thi trực tuyến</Link>
            <Link to="/documents" onClick={() => setIsOpen(false)} className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Văn bản</Link>
            <Link to="/library" onClick={() => setIsOpen(false)} className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Thư viện</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-blue-100 hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Quản trị</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
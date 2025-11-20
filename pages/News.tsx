
import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, ChevronRight } from 'lucide-react';

const News: React.FC = () => {
  const { news } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-youth-blue">Tin Tức - Sự Kiện</h1>
          <p className="text-gray-600 mt-3">Cập nhật những thông tin mới nhất về công tác Đoàn và phong trào thanh thiếu nhi.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm shadow-sm"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <Link to={`/news/${item.id}`} key={item.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 h-full">
                <div className="h-52 relative overflow-hidden">
                  <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.imageUrl} alt={item.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                      <Calendar size={12} className="mr-1" /> {item.date}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">{item.title}</h3>
                    <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                       <User size={14} className="mr-1" /> {item.author}
                    </div>
                    <span className="text-youth-blue text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
                      Đọc tiếp <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Không tìm thấy tin tức nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;

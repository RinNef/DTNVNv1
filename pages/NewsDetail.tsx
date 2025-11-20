
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppContext';
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from 'lucide-react';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news } = useAppStore();
  const navigate = useNavigate();

  // Scroll to top when ID changes (navigating between articles)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const article = news.find((n) => n.id === id);
  
  // Get related news (exclude current article, take up to 3)
  const relatedNews = news.filter(n => n.id !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h2>
        <p className="text-gray-600 mb-6">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="text-youth-blue hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 relative">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 md:pb-12">
            <span className="bg-youth-blue text-white px-3 py-1 rounded text-sm font-semibold mb-4 inline-block">
              Tin Hoạt Động
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight shadow-sm">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 mb-12">
          {/* Metadata */}
          <div className="flex flex-wrap items-center text-gray-500 text-sm mb-8 border-b pb-6 gap-4 md:gap-8">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 text-youth-blue" />
              {article.date}
            </div>
            <div className="flex items-center">
              <User size={18} className="mr-2 text-youth-blue" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-youth-blue" />
              5 phút đọc
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
            <p className="font-bold text-xl text-gray-900 mb-6 italic border-l-4 border-youth-blue pl-4">
              {article.summary}
            </p>
            {article.content}
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-youth-blue transition-colors font-medium"
            >
              <ArrowLeft size={20} className="mr-2" />
              Quay lại
            </button>
            
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                Chia sẻ bài viết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <div className="h-8 w-1 bg-youth-blue mr-3 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-900">Tin tức khác</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {relatedNews.map((item) => (
              <Link 
                to={`/news/${item.id}`} 
                key={item.id} 
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <Calendar size={12} className="mr-1" /> {item.date}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-youth-blue transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {item.summary}
                  </p>
                  <div className="text-youth-blue text-sm font-medium flex items-center mt-auto">
                    Xem chi tiết <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;

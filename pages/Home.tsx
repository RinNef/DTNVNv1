
import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Calendar, User, ArrowRight, FileText, Download, ChevronRight, File, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { news, documents } = useAppStore();

  // Get top 3 news
  const recentNews = news.slice(0, 3);
  
  // Get top 5 documents
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-youth-blue overflow-hidden">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover opacity-20" src="https://picsum.photos/1920/600?random=hero" alt="Background" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Tuổi Trẻ Sáng Tạo - Tiên Phong
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Cổng thông tin chính thức của Đoàn Thanh Niên. Cập nhật tin tức, hoạt động phong trào và lan tỏa văn hóa đọc.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/library" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-youth-blue bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10">
              Vào Thư Viện
            </Link>
            <Link to="/events" className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Đăng Ký Hoạt Động
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: News (66%) */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Tin Tức - Hoạt Động</h2>
                <div className="h-1 w-20 bg-youth-blue mt-2 rounded"></div>
              </div>
              <Link to="/news" className="text-youth-blue font-medium hover:text-blue-800 flex items-center">
                Xem tất cả <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid gap-8">
              {recentNews.map((item) => (
                <Link to={`/news/${item.id}`} key={item.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                    <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={item.imageUrl} alt={item.title} />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-sm text-blue-600 mb-2">
                        <Calendar size={14} className="mr-1" /> {item.date}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                      <p className="mt-2 text-gray-600 line-clamp-2 text-sm">{item.summary}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                         <User size={14} className="mr-1" /> {item.author}
                      </div>
                      <span className="text-youth-blue text-sm font-medium flex items-center">
                        Chi tiết <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Documents & Quick Links (33%) */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow-lg border-t-4 border-youth-blue overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FileText className="mr-2 text-youth-blue" size={20} />
                  Văn Bản Mới
                </h3>
                <Link to="/documents" className="text-xs text-blue-600 font-medium hover:underline">Xem kho</Link>
              </div>
              
              <div className="divide-y divide-gray-100">
                {recentDocs.length > 0 ? (
                  recentDocs.map((doc) => (
                    <Link 
                      to={`/documents/${doc.id}`} 
                      key={doc.id} 
                      className="block p-4 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded mb-1
                            ${doc.category === 'Nghị quyết' ? 'bg-red-100 text-red-800' : 
                              doc.category === 'Biểu mẫu' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {doc.category}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 leading-snug mb-1">
                            {doc.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-3">{doc.uploadDate}</span>
                            <span>{doc.fileSize}</span>
                          </div>
                        </div>
                        <div 
                          className="flex-shrink-0 bg-gray-100 p-2 rounded-full text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                   <div className="p-8 text-center text-gray-500">
                     <File size={32} className="mx-auto mb-2 opacity-50" />
                     Chưa có văn bản nào.
                   </div>
                )}
              </div>
              <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <Link to="/documents" className="text-sm font-medium text-gray-600 hover:text-youth-blue block">
                  Tra cứu tất cả văn bản
                </Link>
              </div>
            </div>

            {/* Quick Links / Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Thi Trực Tuyến</h3>
              <p className="text-blue-100 text-sm mb-6">
                Tham gia các cuộc thi tìm hiểu về Đoàn, Đảng và Lịch sử dân tộc để nhận nhiều phần quà hấp dẫn.
              </p>
              <Link to="/competitions" className="block w-full text-center bg-white text-blue-800 py-2 rounded font-bold hover:bg-blue-50 transition-colors">
                Tham gia ngay
              </Link>
            </div>

             <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Thư Viện Số</h3>
              <p className="text-red-100 text-sm mb-6">
                Hàng trăm đầu sách kỹ năng, lịch sử và văn học đang chờ bạn khám phá.
              </p>
              <Link to="/library" className="block w-full text-center bg-white text-red-700 py-2 rounded font-bold hover:bg-red-50 transition-colors">
                Đọc sách ngay
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
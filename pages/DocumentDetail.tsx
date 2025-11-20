
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../context/AppContext';
import { FileText, Download, ArrowLeft, Calendar, HardDrive, Printer, Share2 } from 'lucide-react';

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { documents } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy văn bản</h2>
        <button onClick={() => navigate('/documents')} className="text-youth-blue hover:underline flex items-center">
          <ArrowLeft size={20} className="mr-2" /> Quay lại kho văn bản
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Toolbar - Hidden on Print */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
          <button 
            onClick={() => navigate('/documents')}
            className="flex items-center text-gray-600 hover:text-youth-blue transition-colors font-medium self-start md:self-auto"
          >
            <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Printer size={18} className="mr-2" /> In
            </button>
            <a 
              href={doc.downloadUrl}
              className="flex items-center px-4 py-2 bg-youth-blue text-white rounded-md hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Download size={18} className="mr-2" /> Tải về
            </a>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-8 text-center print:bg-white print:border-none print:pb-4">
            <span className={`inline-block px-3 py-1 mb-4 text-sm font-bold uppercase tracking-wide rounded
              ${doc.category === 'Nghị quyết' ? 'bg-red-100 text-red-800' : 
                doc.category === 'Biểu mẫu' ? 'bg-green-100 text-green-800' : 
                doc.category === 'Hướng dẫn' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {doc.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight mb-4 uppercase">
              {doc.title}
            </h1>
            <div className="flex justify-center gap-6 text-sm text-gray-500 print:hidden">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1.5" /> Ngày đăng: {doc.uploadDate}
              </div>
              <div className="flex items-center">
                <HardDrive size={16} className="mr-1.5" /> Dung lượng: {doc.fileSize}
              </div>
            </div>
          </div>

          {/* Content Body - Simulating A4 Paper */}
          <div className="p-8 md:p-16 min-h-[600px] bg-white font-serif text-gray-900 leading-relaxed text-lg whitespace-pre-line">
            {doc.content ? (
              doc.content
            ) : (
              <div className="text-center text-gray-400 italic py-20 flex flex-col items-center">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>Nội dung chi tiết chưa được cập nhật.</p>
                <p className="text-sm mt-2">Vui lòng tải file về để xem nội dung đầy đủ.</p>
              </div>
            )}
          </div>

          {/* Footer - Hidden on Print */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-between items-center print:hidden">
             <div className="text-sm text-gray-500">
               Cổng thông tin Đoàn Thanh Niên
             </div>
             <button className="text-gray-500 hover:text-blue-600 flex items-center text-sm">
               <Share2 size={16} className="mr-2" /> Chia sẻ liên kết
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
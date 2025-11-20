
import React from 'react';
import { useAppStore } from '../context/AppContext';
import { FileText, Download, Search, File, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documents: React.FC = () => {
  const { documents } = useAppStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('All');

  const types = ['All', 'Biểu mẫu', 'Nghị quyết', 'Hướng dẫn', 'Khác'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || doc.category === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-youth-blue">Kho Văn Bản & Biểu Mẫu</h1>
          <p className="text-gray-600 mt-2">Lưu trữ các văn bản chính thức, nghị quyết và biểu mẫu công tác Đoàn.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-2 w-full md:w-auto overflow-x-auto">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                    filterType === t ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm văn bản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên văn bản
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày ban hành
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dung lượng
                  </th>
                  <th scope="col" className="relative px-6 py-3 text-right">
                    <span className="sr-only">Hành động</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/documents/${doc.id}`} className="flex items-center group-hover:text-blue-700">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 group-hover:underline">{doc.title}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{doc.uploadDate}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploadDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.fileSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link 
                          to={`/documents/${doc.id}`} 
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Xem nội dung"
                        >
                          <Eye size={18} />
                        </Link>
                        <a 
                          href={doc.downloadUrl} 
                          className="text-gray-500 hover:text-blue-600 flex items-center"
                          title="Tải về"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      <File size={48} className="mx-auto text-gray-300 mb-2" />
                      Không tìm thấy văn bản nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
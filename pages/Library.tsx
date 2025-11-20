
import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Book, BookCategory } from '../types';
import { Search, BookOpen, MessageSquare, Send, X, AlertCircle, Info } from 'lucide-react';
import { askLibrarian } from '../services/geminiService';

const Library: React.FC = () => {
  const { books, addRental } = useAppStore();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // For Rental Form
  const [viewingBook, setViewingBook] = useState<Book | null>(null); // For Detail Modal
  
  // Rental Form State
  const [renterName, setRenterName] = useState('');
  const [renterEmail, setRenterEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Xin chào! Tôi là Thủ thư AI. Bạn cần tìm sách gì hôm nay?' }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const categories = ['All', ...Object.values(BookCategory)];

  const filteredBooks = books.filter(book => {
    const matchesCategory = filterCategory === 'All' || book.category === filterCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openRentalForm = (book: Book) => {
    setViewingBook(null);
    setSelectedBook(book);
  }

  const handleRentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    addRental({
      id: Date.now().toString(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      userName: renterName,
      userEmail: renterEmail,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedBook(null);
      setRenterName('');
      setRenterEmail('');
    }, 2000);
  };

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiThinking(true);

    // Prepare context for AI
    const contextData = books.map(b => `${b.title} (${b.category}) của ${b.author}`).join('; ');
    const response = await askLibrarian(userMsg, contextData);

    setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsAiThinking(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-youth-blue">Thư Viện Thanh Niên</h1>
          <p className="text-gray-600 mt-2">Tri thức là sức mạnh. Đăng ký mượn sách ngay hôm nay.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow mb-8 gap-4">
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  filterCategory === cat 
                  ? 'bg-youth-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm sách, tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-all group">
              <div 
                className="h-64 overflow-hidden relative cursor-pointer"
                onClick={() => setViewingBook(book)}
              >
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Info size={14} className="mr-1" /> Xem chi tiết
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {book.category}
                  </span>
                  <span className={`text-xs font-bold ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.available > 0 ? `Còn ${book.available}` : 'Hết sách'}
                  </span>
                </div>
                <h3 
                  className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-youth-blue" 
                  title={book.title}
                  onClick={() => setViewingBook(book)}
                >
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                
                <div className="mt-auto">
                  <button
                    onClick={() => openRentalForm(book)}
                    disabled={book.available === 0}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      book.available > 0 ? 'bg-youth-blue hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen size={16} className="mr-2" />
                    {book.available > 0 ? 'Đăng ký mượn' : 'Tạm hết'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Detail Modal */}
      {viewingBook && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full relative overflow-hidden flex flex-col md:flex-row">
            <button 
              onClick={() => setViewingBook(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-100 relative">
              <img 
                src={viewingBook.coverUrl} 
                alt={viewingBook.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-2/3 p-8 flex flex-col">
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                    {viewingBook.category}
                  </span>
                  {viewingBook.available > 0 ? (
                    <span className="text-green-600 text-xs font-bold flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                      Còn {viewingBook.available} cuốn
                    </span>
                  ) : (
                    <span className="text-red-600 text-xs font-bold">Hết sách</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{viewingBook.title}</h2>
                <p className="text-gray-600 font-medium mb-6">Tác giả: {viewingBook.author}</p>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <h3 className="font-bold text-youth-blue mb-2 flex items-center">
                    <Info size={18} className="mr-2" />
                    Nội dung chính
                  </h3>
                  <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {viewingBook.detailedSummary || viewingBook.description || "Chưa có tóm tắt chi tiết cho sách này."}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setViewingBook(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Đóng
                </button>
                <button
                  onClick={() => openRentalForm(viewingBook)}
                  disabled={viewingBook.available === 0}
                  className={`px-6 py-2 rounded-md text-white text-sm font-medium flex items-center ${
                    viewingBook.available > 0 
                    ? 'bg-youth-blue hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all' 
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <BookOpen size={16} className="mr-2" />
                  Đăng ký mượn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rental Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setSelectedBook(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Đăng Ký Mượn Sách</h2>
            
            {showSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Thành công!</h3>
                  <p className="text-sm text-green-700 mt-1">Yêu cầu của bạn đã được gửi.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRentSubmit} className="space-y-4">
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm font-semibold text-gray-800">{selectedBook.title}</p>
                  <p className="text-xs text-gray-500">{selectedBook.author}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    required
                    type="text"
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email liên hệ</label>
                  <input
                    required
                    type="email"
                    value={renterEmail}
                    onChange={(e) => setRenterEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-youth-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Xác nhận đăng ký
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isChatOpen ? 'w-80 sm:w-96' : 'w-auto'}`}>
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center space-x-2 bg-youth-blue text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquare size={20} />
            <span className="font-medium">Hỏi Thủ Thư AI</span>
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-[500px]">
            <div className="bg-youth-blue text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MessageSquare size={18} />
                <span className="font-bold">Thủ Thư AI (Gemini)</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                 <div className="flex justify-start">
                  <div className="bg-white text-gray-500 p-3 rounded-lg border border-gray-200 rounded-bl-none shadow-sm text-xs italic">
                    Đang suy nghĩ...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAiChat} className="p-3 border-t bg-white rounded-b-lg flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tìm sách, hỏi nội dung..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit" 
                disabled={isAiThinking || !chatInput.trim()}
                className="bg-youth-blue text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
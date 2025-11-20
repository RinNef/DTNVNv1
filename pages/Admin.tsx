
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { Book, BookCategory, NewsArticle, YouthEvent, DocumentItem, QuizCompetition, EventRegistration } from '../types';
import { Trash2, Plus, Check, X, PenTool, Sparkles, Book as BookIcon, FileText, Users, Calendar, Download, Award, Eye, Lock, LogOut } from 'lucide-react';
import { generateNewsContent, generateEventPlan, generateQuizQuestions, generateBookSummary } from '../services/geminiService';

const Admin: React.FC = () => {
  const { 
    news, books, rentals, events, documents, quizzes,
    addNews, deleteNews, 
    addBook, deleteBook, 
    updateRentalStatus,
    addEvent, deleteEvent,
    addDocument, deleteDocument,
    addQuiz, deleteQuiz
  } = useAppStore();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setUsername('');
    setPassword('');
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'books' | 'rentals' | 'events' | 'documents' | 'quizzes'>('dashboard');

  // New Article State
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  // New Book State
  const [showBookModal, setShowBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<BookCategory>(BookCategory.OTHER);
  const [newBookQty, setNewBookQty] = useState(1);
  const [newBookSummary, setNewBookSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // New Event State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventSummary, setNewEventSummary] = useState(''); // Short description
  const [newEventContent, setNewEventContent] = useState(''); // Detailed Plan
  const [newEventLimit, setNewEventLimit] = useState(50);
  const [isPlanningEvent, setIsPlanningEvent] = useState(false);
  
  // Event Participants Modal State
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEventForList, setSelectedEventForList] = useState<YouthEvent | null>(null);

  // New Document State
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentItem['category']>('Biểu mẫu');
  const [newDocContent, setNewDocContent] = useState('');

  // New Quiz State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizTopic, setNewQuizTopic] = useState('');
  const [newQuizTime, setNewQuizTime] = useState(15);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // AI Handlers
  const handleGenerateContent = async () => {
    if (!newArticleTitle) return alert("Vui lòng nhập chủ đề/tiêu đề trước.");
    setIsGenerating(true);
    const content = await generateNewsContent(newArticleTitle);
    setNewArticleContent(content);
    setIsGenerating(false);
  };

  const handlePlanEvent = async () => {
    if (!newEventTitle) return alert("Vui lòng nhập tên sự kiện trước.");
    setIsPlanningEvent(true);
    const plan = await generateEventPlan(newEventTitle);
    setNewEventContent(plan);
    // Auto fill summary if empty
    if (!newEventSummary) {
        setNewEventSummary(`Sự kiện ${newEventTitle} dự kiến tổ chức tại ${newEventLocation || '...'} với nhiều hoạt động ý nghĩa.`);
    }
    setIsPlanningEvent(false);
  };

  const handleGenerateQuiz = async () => {
    if (!newQuizTopic) return alert("Vui lòng nhập chủ đề câu hỏi.");
    setIsGeneratingQuiz(true);
    const questions = await generateQuizQuestions(newQuizTopic, 5);
    setGeneratedQuestions(questions);
    setIsGeneratingQuiz(false);
  }

  const handleGenerateBookSummary = async () => {
    if (!newBookTitle || !newBookAuthor) return alert("Vui lòng nhập Tên sách và Tác giả.");
    setIsGeneratingSummary(true);
    const summary = await generateBookSummary(newBookTitle, newBookAuthor);
    setNewBookSummary(summary);
    setIsGeneratingSummary(false);
  }

  const handleViewParticipants = (event: YouthEvent) => {
    setSelectedEventForList(event);
    setShowParticipantsModal(true);
  }

  const exportParticipantsToCSV = () => {
    if (!selectedEventForList) return;

    const headers = ["Họ và Tên", "Số Điện Thoại", "Ngày Đăng Ký"];
    const rows = selectedEventForList.registrations.map(reg => [reg.userName, reg.userPhone, reg.registeredAt]);
    
    const csvContent = [
        headers.join(","), 
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_dang_ky_${selectedEventForList.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Handlers
  const handleSaveNews = () => {
    if (!newArticleTitle || !newArticleContent) return;
    addNews({
      id: Date.now().toString(),
      title: newArticleTitle,
      content: newArticleContent,
      summary: newArticleContent.substring(0, 100) + '...',
      imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin'
    });
    setShowNewsModal(false);
    setNewArticleTitle('');
    setNewArticleContent('');
  };

  const handleSaveBook = () => {
    if (!newBookTitle || !newBookAuthor) return;
    addBook({
      id: 'b' + Date.now(),
      title: newBookTitle,
      author: newBookAuthor,
      category: newBookCategory,
      coverUrl: `https://picsum.photos/300/450?random=${Date.now()}`,
      available: newBookQty,
      description: newBookSummary.substring(0, 100) + '...',
      detailedSummary: newBookSummary
    });
    setShowBookModal(false);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookSummary('');
    setNewBookQty(1);
  };

  const handleSaveEvent = () => {
    if (!newEventTitle || !newEventDate) return;
    addEvent({
      id: 'e' + Date.now(),
      title: newEventTitle,
      date: newEventDate,
      location: newEventLocation || 'Trụ sở Đoàn',
      description: newEventSummary || 'Hoạt động phong trào thanh niên.',
      content: newEventContent,
      maxParticipants: newEventLimit,
      registeredCount: 0,
      registrations: [],
      imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`
    });
    setShowEventModal(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventLocation('');
    setNewEventSummary('');
    setNewEventContent('');
  };

  const handleSaveDoc = () => {
    if(!newDocTitle) return;
    addDocument({
      id: 'd' + Date.now(),
      title: newDocTitle,
      category: newDocCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '1.0 MB',
      downloadUrl: '#',
      content: newDocContent || 'Nội dung văn bản đang cập nhật...'
    });
    setShowDocModal(false);
    setNewDocTitle('');
    setNewDocContent('');
  };

  const handleSaveQuiz = () => {
    if(!newQuizTitle || generatedQuestions.length === 0) return;
    addQuiz({
      id: 'q' + Date.now(),
      title: newQuizTitle,
      description: newQuizDesc,
      status: 'active',
      timeLimitMinutes: newQuizTime,
      questions: generatedQuestions
    });
    setShowQuizModal(false);
    setNewQuizTitle('');
    setNewQuizDesc('');
    setNewQuizTopic('');
    setGeneratedQuestions([]);
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition-colors mb-1 ${
        activeTab === id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} className="mr-3" />
      {label}
    </button>
  );

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-youth-blue p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <Lock className="text-youth-blue" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Đăng Nhập Quản Trị</h2>
            <p className="text-blue-100 mt-2">Cổng thông tin Đoàn Thanh Niên</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm text-center">
                  {authError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập tài khoản (admin)"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập mật khẩu (admin)"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-youth-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Đăng Nhập
              </button>
            </form>
            <div className="mt-6 text-center">
               <p className="text-xs text-gray-500">Hệ thống dành riêng cho Ban Chấp Hành Đoàn</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Panel
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Admin Panel</h2>
          <p className="text-xs text-gray-500 mt-1">Xin chào, {username}</p>
        </div>
        <nav className="px-4 pb-6 flex-1 overflow-y-auto">
          <TabButton id="dashboard" label="Tổng quan" icon={Users} />
          <TabButton id="news" label="Quản lý Tin tức" icon={PenTool} />
          <TabButton id="events" label="Quản lý Hoạt động" icon={Calendar} />
          <TabButton id="quizzes" label="Thi trực tuyến" icon={Award} />
          <TabButton id="documents" label="Quản lý Văn bản" icon={FileText} />
          <TabButton id="books" label="Quản lý Sách" icon={BookIcon} />
          <TabButton id="rentals" label="Yêu cầu Mượn" icon={Check} />
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Tổng quan hoạt động</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Sự kiện sắp tới</p>
                    <p className="text-3xl font-bold text-gray-800">{events.length}</p>
                  </div>
                  <Calendar className="text-blue-200 h-10 w-10" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bài viết tin tức</p>
                    <p className="text-3xl font-bold text-gray-800">{news.length}</p>
                  </div>
                  <PenTool className="text-green-200 h-10 w-10" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Cuộc thi online</p>
                    <p className="text-3xl font-bold text-gray-800">{quizzes.length}</p>
                  </div>
                  <Award className="text-red-200 h-10 w-10" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Tổng đầu sách</p>
                    <p className="text-3xl font-bold text-gray-800">{books.length}</p>
                  </div>
                  <BookIcon className="text-purple-200 h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin tức</h1>
              <button 
                onClick={() => setShowNewsModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-2" /> Viết bài mới
              </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteNews(item.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
           <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Hoạt động</h1>
               <button 
                onClick={() => setShowEventModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-2" /> Tạo sự kiện
              </button>
            </div>
             <div className="space-y-4">
               {events.map(event => (
                 <div key={event.id} className="bg-white p-4 shadow rounded-lg flex flex-col md:flex-row justify-between items-center">
                   <div className="flex-1">
                     <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                     <p className="text-sm text-gray-500 flex items-center mt-1">
                       <Calendar size={14} className="mr-1" /> {event.date} - <span className="ml-1 text-blue-600">{event.location}</span>
                     </p>
                     <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                   </div>
                   <div className="mt-4 md:mt-0 md:ml-6 flex items-center space-x-4">
                      <div className="text-center px-4 border-l">
                        <span className="block text-xl font-bold text-blue-600">{event.registeredCount}</span>
                        <span className="text-xs text-gray-500">Đăng ký</span>
                      </div>
                      <button 
                        onClick={() => handleViewParticipants(event)} 
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center text-sm border border-blue-200"
                        title="Xem danh sách đăng ký"
                      >
                        <Eye size={16} className="mr-1" /> Danh sách
                      </button>
                      <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <Trash2 size={20} />
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
           <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Cuộc thi</h1>
               <button 
                onClick={() => setShowQuizModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-2" /> Tạo cuộc thi
              </button>
            </div>
             <div className="space-y-4">
               {quizzes.map(quiz => (
                 <div key={quiz.id} className="bg-white p-4 shadow rounded-lg flex flex-col md:flex-row justify-between items-center">
                   <div className="flex-1">
                     <div className="flex items-center mb-1">
                       <h3 className="font-bold text-lg text-gray-900 mr-2">{quiz.title}</h3>
                       <span className={`px-2 py-0.5 text-xs rounded-full ${quiz.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                         {quiz.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                       </span>
                     </div>
                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">{quiz.description}</p>
                   </div>
                   <div className="mt-4 md:mt-0 md:ml-6 flex items-center space-x-4">
                      <div className="text-center px-4 border-l">
                        <span className="block text-xl font-bold text-blue-600">{quiz.questions.length}</span>
                        <span className="text-xs text-gray-500">Câu hỏi</span>
                      </div>
                      <button onClick={() => deleteQuiz(quiz.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                        <Trash2 size={20} />
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
           <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Văn bản</h1>
               <button 
                onClick={() => setShowDocModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-2" /> Thêm văn bản
              </button>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên văn bản</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Xóa</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteDocument(doc.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div>
             <h1 className="text-2xl font-bold text-gray-900 mb-6">Yêu cầu mượn sách</h1>
             <div className="bg-white shadow rounded-lg overflow-hidden">
               <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người mượn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sách</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Xử lý</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rentals.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-sm text-gray-900">{item.bookTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.status === 'approved' ? 'Đã duyệt' : 
                           item.status === 'pending' ? 'Chờ duyệt' : 
                           item.status === 'rejected' ? 'Từ chối' : 'Đã trả'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {item.status === 'pending' && (
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => updateRentalStatus(item.id, 'approved')} className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"><Check size={16} /></button>
                            <button onClick={() => updateRentalStatus(item.id, 'rejected')} className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"><X size={16} /></button>
                          </div>
                        )}
                         {item.status === 'approved' && (
                           <button onClick={() => updateRentalStatus(item.id, 'returned')} className="text-blue-600 hover:text-blue-900 text-xs underline">Đánh dấu đã trả</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        )}
        
        {/* Books Tab */}
        {activeTab === 'books' && (
           <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Kho Sách</h1>
               <button 
                onClick={() => setShowBookModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus size={18} className="mr-2" /> Thêm sách mới
              </button>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {books.map(book => (
                 <div key={book.id} className="bg-white p-4 shadow rounded flex flex-col relative">
                    <button onClick={() => deleteBook(book.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                   <img src={book.coverUrl} alt="" className="h-40 object-contain mb-2 bg-gray-50" />
                   <h3 className="font-bold text-sm line-clamp-1">{book.title}</h3>
                   <p className="text-xs text-gray-500">{book.author}</p>
                   <div className="mt-2 flex justify-between text-xs">
                     <span>SL: {book.available}</span>
                     <span className="text-blue-600">{book.category}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

      </div>

      {/* Modal: Event Participants List */}
      {showParticipantsModal && selectedEventForList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-blue-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Danh sách đăng ký</h3>
                <p className="text-sm text-gray-600">{selectedEventForList.title}</p>
              </div>
              <button onClick={() => setShowParticipantsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1">
              {(!selectedEventForList.registrations || selectedEventForList.registrations.length === 0) ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <Users size={48} className="mb-4 text-gray-300" />
                  <p>Chưa có ai đăng ký tham gia sự kiện này.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện Thoại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Đăng Ký</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEventForList.registrations.map((reg, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.userPhone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.registeredAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
               <button 
                  onClick={() => setShowParticipantsModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Đóng
                </button>
                <button 
                  onClick={exportParticipantsToCSV}
                  disabled={!selectedEventForList.registrations || selectedEventForList.registrations.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Download size={18} className="mr-2" /> Xuất Excel / CSV
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create News */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Đăng Tin Mới</h3>
              <button onClick={() => setShowNewsModal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề / Tiêu đề</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Nhập tiêu đề tin tức..."
                  />
                  <button 
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center whitespace-nowrap disabled:opacity-50"
                  >
                    <Sparkles size={16} className="mr-2" />
                    {isGenerating ? 'Đang viết...' : 'AI Viết bài'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea 
                  value={newArticleContent}
                  onChange={(e) => setNewArticleContent(e.target.value)}
                  rows={10}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setShowNewsModal(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Hủy</button>
              <button onClick={handleSaveNews} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Đăng bài</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Tạo Sự Kiện Mới</h3>
              <button onClick={() => setShowEventModal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên sự kiện</label>
                <input type="text" className="w-full border p-2 rounded" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày diễn ra</label>
                  <input type="date" className="w-full border p-2 rounded" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số lượng tối đa</label>
                  <input type="number" className="w-full border p-2 rounded" value={newEventLimit} onChange={e => setNewEventLimit(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
                <input type="text" className="w-full border p-2 rounded" value={newEventLocation} onChange={e => setNewEventLocation(e.target.value)} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                  <input 
                    type="text" 
                    className="w-full border p-2 rounded" 
                    value={newEventSummary} 
                    onChange={e => setNewEventSummary(e.target.value)} 
                    placeholder="Mô tả ngắn gọn cho danh sách..."
                  />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Nội dung chi tiết / Kế hoạch</label>
                  <button 
                    onClick={handlePlanEvent}
                    disabled={isPlanningEvent}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 flex items-center"
                  >
                     <Sparkles size={12} className="mr-1" />
                     {isPlanningEvent ? 'Đang lập kế hoạch...' : 'AI Lập kế hoạch'}
                  </button>
                </div>
                <textarea 
                  value={newEventContent}
                  onChange={(e) => setNewEventContent(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Chi tiết chương trình, nội dung, lịch trình..."
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setShowEventModal(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Hủy</button>
              <button onClick={handleSaveEvent} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu sự kiện</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Quiz */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Tạo Cuộc Thi Trắc Nghiệm</h3>
              <button onClick={() => setShowQuizModal(false)}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên cuộc thi</label>
                <input type="text" className="w-full border p-2 rounded" value={newQuizTitle} onChange={e => setNewQuizTitle(e.target.value)} placeholder="VD: Tìm hiểu ngày thành lập Đoàn..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea className="w-full border p-2 rounded" value={newQuizDesc} onChange={e => setNewQuizDesc(e.target.value)} rows={2} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700">Thời gian làm bài (phút)</label>
                 <input type="number" className="w-full border p-2 rounded" value={newQuizTime} onChange={e => setNewQuizTime(Number(e.target.value))} />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Sparkles size={16} className="mr-2" />
                  AI Sinh Câu Hỏi Tự Động
                </h4>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    className="flex-1 border p-2 rounded" 
                    value={newQuizTopic} 
                    onChange={e => setNewQuizTopic(e.target.value)} 
                    placeholder="Nhập chủ đề câu hỏi (VD: Lịch sử Đoàn, Luật Thanh Niên...)"
                   />
                   <button 
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                   >
                     {isGeneratingQuiz ? 'Đang tạo...' : 'Tạo câu hỏi'}
                   </button>
                </div>
                
                {generatedQuestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-green-700">Đã tạo thành công {generatedQuestions.length} câu hỏi:</p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 max-h-40 overflow-y-auto">
                      {generatedQuestions.map((q, idx) => (
                        <li key={idx}>{q.question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setShowQuizModal(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Hủy</button>
              <button 
                onClick={handleSaveQuiz} 
                disabled={generatedQuestions.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Lưu cuộc thi
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Modal: Add Document */}
       {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Thêm Văn Bản</h3>
              <button onClick={() => setShowDocModal(false)}><X size={24} /></button>
            </div>
             <div className="p-6 space-y-4 overflow-y-auto">
                <input type="text" placeholder="Tên văn bản" className="w-full border p-2 rounded" value={newDocTitle} onChange={e => setNewDocTitle(e.target.value)} />
                <select className="w-full border p-2 rounded" value={newDocCategory} onChange={(e) => setNewDocCategory(e.target.value as any)}>
                  <option value="Biểu mẫu">Biểu mẫu</option>
                  <option value="Nghị quyết">Nghị quyết</option>
                  <option value="Hướng dẫn">Hướng dẫn</option>
                  <option value="Khác">Khác</option>
                </select>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center items-center text-gray-500">
                  <span>Kéo thả file hoặc click để tải lên (Demo)</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung văn bản (hiển thị online)</label>
                  <textarea 
                    className="w-full border p-2 rounded" 
                    rows={6}
                    value={newDocContent} 
                    onChange={e => setNewDocContent(e.target.value)}
                    placeholder="Nhập nội dung văn bản để hiển thị trên trang đọc..."
                  />
                </div>
             </div>
             <div className="p-4 border-t flex justify-end space-x-3">
               <button onClick={() => setShowDocModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
               <button onClick={handleSaveDoc} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
             </div>
          </div>
        </div>
      )}
      
      {/* Modal: Add Book */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Thêm Sách Mới</h3>
              <button onClick={() => setShowBookModal(false)}><X size={24} /></button>
            </div>
             <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên sách</label>
                  <input type="text" className="w-full border p-2 rounded" value={newBookTitle} onChange={e => setNewBookTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                  <input type="text" className="w-full border p-2 rounded" value={newBookAuthor} onChange={e => setNewBookAuthor(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thể loại</label>
                    <select className="w-full border p-2 rounded" value={newBookCategory} onChange={(e) => setNewBookCategory(e.target.value as BookCategory)}>
                      {Object.values(BookCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                    <input type="number" className="w-full border p-2 rounded" value={newBookQty} onChange={e => setNewBookQty(parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Tóm tắt / Nội dung chính</label>
                    <button 
                      onClick={handleGenerateBookSummary}
                      disabled={isGeneratingSummary}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 flex items-center disabled:opacity-50"
                    >
                       <Sparkles size={12} className="mr-1" />
                       {isGeneratingSummary ? 'Đang tạo...' : 'AI Tóm tắt'}
                    </button>
                  </div>
                  <textarea 
                    rows={5} 
                    className="w-full border p-2 rounded" 
                    value={newBookSummary} 
                    onChange={e => setNewBookSummary(e.target.value)}
                    placeholder="Nhập nội dung chính hoặc dùng AI..." 
                  />
                </div>
             </div>
             <div className="p-4 border-t flex justify-end space-x-3">
               <button onClick={() => setShowBookModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Hủy</button>
               <button onClick={handleSaveBook} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;

import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { QuizCompetition } from '../types';
import { Play, Clock, CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';

const Competitions: React.FC = () => {
  const { quizzes } = useAppStore();
  const [activeQuiz, setActiveQuiz] = useState<QuizCompetition | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const startQuiz = (quiz: QuizCompetition) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setUserAnswers(new Array(quiz.questions.length).fill(-1));
    setShowResults(false);
    setScore(0);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIdx] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetView = () => {
    setActiveQuiz(null);
    setShowResults(false);
  };

  if (showResults && activeQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600">
             <Award size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Kết Quả Thi</h2>
          <p className="text-gray-600 mb-8">{activeQuiz.title}</p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="text-lg text-gray-700">Bạn đã trả lời đúng:</p>
            <p className="text-5xl font-bold text-blue-600 my-2">
              {score} <span className="text-2xl text-gray-400">/ {activeQuiz.questions.length}</span>
            </p>
            <p className="text-sm text-gray-500">
              {score === activeQuiz.questions.length ? 'Xuất sắc! Bạn đã nắm vững kiến thức.' : 
               score > activeQuiz.questions.length / 2 ? 'Khá tốt! Hãy cố gắng hơn nữa.' : 'Cần ôn tập thêm.'}
            </p>
          </div>

          <button 
            onClick={resetView}
            className="w-full py-3 bg-youth-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{activeQuiz.title}</h2>
            <div className="flex items-center text-gray-600 bg-white px-3 py-1 rounded shadow-sm">
              <Clock size={16} className="mr-2" />
              <span>{activeQuiz.timeLimitMinutes} phút</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
              Câu hỏi {currentQuestionIdx + 1} / {activeQuiz.questions.length}
            </span>
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswers[currentQuestionIdx] === idx 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                      userAnswers[currentQuestionIdx] === idx ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={userAnswers[currentQuestionIdx] === -1}
                className="flex items-center px-6 py-3 bg-youth-blue text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIdx === activeQuiz.questions.length - 1 ? 'Nộp bài' : 'Câu tiếp theo'}
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-youth-blue">Thi Trực Tuyến</h1>
          <p className="text-gray-600 mt-3">Nâng cao kiến thức Đoàn - Hội - Đội qua các bài kiểm tra trắc nghiệm.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${quiz.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {quiz.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock size={14} className="mr-1" /> {quiz.timeLimitMinutes} phút
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{quiz.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {quiz.questions.length} câu hỏi
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => startQuiz(quiz)}
                  disabled={quiz.status !== 'active'}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                    quiz.status === 'active' ? 'bg-youth-blue hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Play size={16} className="mr-2" />
                  {quiz.status === 'active' ? 'Vào thi ngay' : 'Đã đóng'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Competitions;

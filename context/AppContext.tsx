
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, NewsArticle, RentalRequest, YouthEvent, DocumentItem, QuizCompetition } from '../types';
import { INITIAL_BOOKS, INITIAL_NEWS, INITIAL_RENTALS, INITIAL_EVENTS, INITIAL_DOCUMENTS, INITIAL_QUIZZES } from '../services/mockData';

interface AppState {
  books: Book[];
  news: NewsArticle[];
  rentals: RentalRequest[];
  events: YouthEvent[];
  documents: DocumentItem[];
  quizzes: QuizCompetition[];
  addBook: (book: Book) => void;
  addNews: (article: NewsArticle) => void;
  addRental: (rental: RentalRequest) => void;
  addEvent: (event: YouthEvent) => void;
  addDocument: (doc: DocumentItem) => void;
  addQuiz: (quiz: QuizCompetition) => void;
  updateRentalStatus: (id: string, status: RentalRequest['status']) => void;
  deleteNews: (id: string) => void;
  deleteBook: (id: string) => void;
  deleteEvent: (id: string) => void;
  deleteDocument: (id: string) => void;
  deleteQuiz: (id: string) => void;
  registerForEvent: (eventId: string, participant: { name: string; phone: string }) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [rentals, setRentals] = useState<RentalRequest[]>(INITIAL_RENTALS);
  const [events, setEvents] = useState<YouthEvent[]>(INITIAL_EVENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [quizzes, setQuizzes] = useState<QuizCompetition[]>(INITIAL_QUIZZES);

  // Load from local storage on mount
  useEffect(() => {
    const storedBooks = localStorage.getItem('books');
    const storedNews = localStorage.getItem('news');
    const storedRentals = localStorage.getItem('rentals');
    const storedEvents = localStorage.getItem('events');
    const storedDocs = localStorage.getItem('documents');
    const storedQuizzes = localStorage.getItem('quizzes');

    if (storedBooks) setBooks(JSON.parse(storedBooks));
    if (storedNews) setNews(JSON.parse(storedNews));
    if (storedRentals) setRentals(JSON.parse(storedRentals));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    if (storedDocs) setDocuments(JSON.parse(storedDocs));
    if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('news', JSON.stringify(news));
    localStorage.setItem('rentals', JSON.stringify(rentals));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('documents', JSON.stringify(documents));
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [books, news, rentals, events, documents, quizzes]);

  const addBook = (book: Book) => setBooks(prev => [...prev, book]);
  const addNews = (article: NewsArticle) => setNews(prev => [article, ...prev]);
  const addRental = (rental: RentalRequest) => setRentals(prev => [rental, ...prev]);
  const addEvent = (event: YouthEvent) => setEvents(prev => [event, ...prev]);
  const addDocument = (doc: DocumentItem) => setDocuments(prev => [doc, ...prev]);
  const addQuiz = (quiz: QuizCompetition) => setQuizzes(prev => [quiz, ...prev]);
  
  const updateRentalStatus = (id: string, status: RentalRequest['status']) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const registerForEvent = (eventId: string, participant: { name: string; phone: string }) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId && e.registeredCount < e.maxParticipants 
        ? { 
            ...e, 
            registeredCount: e.registeredCount + 1,
            registrations: [...(e.registrations || []), {
              userName: participant.name,
              userPhone: participant.phone,
              registeredAt: new Date().toLocaleDateString('vi-VN')
            }]
          } 
        : e
    ));
  };

  const deleteNews = (id: string) => setNews(prev => prev.filter(n => n.id !== id));
  const deleteBook = (id: string) => setBooks(prev => prev.filter(b => b.id !== id));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const deleteDocument = (id: string) => setDocuments(prev => prev.filter(d => d.id !== id));
  const deleteQuiz = (id: string) => setQuizzes(prev => prev.filter(q => q.id !== id));

  return (
    <AppContext.Provider value={{ 
      books, news, rentals, events, documents, quizzes,
      addBook, addNews, addRental, addEvent, addDocument, addQuiz,
      updateRentalStatus, deleteNews, deleteBook, deleteEvent, deleteDocument, deleteQuiz,
      registerForEvent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
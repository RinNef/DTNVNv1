
export enum BookCategory {
  HISTORY = 'Lịch sử',
  SKILLS = 'Kỹ năng',
  LITERATURE = 'Văn học',
  SCIENCE = 'Khoa học',
  POLITICS = 'Chính trị',
  OTHER = 'Khác'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  coverUrl: string;
  available: number;
  description: string; // Short description
  detailedSummary?: string; // Detailed key contents
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
}

export interface RentalRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  userName: string;
  userEmail: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
}

export interface EventRegistration {
  userName: string;
  userPhone: string;
  registeredAt: string;
}

export interface YouthEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string; // Short summary
  content?: string; // Detailed plan/itinerary
  maxParticipants: number;
  registeredCount: number;
  registrations: EventRegistration[];
  imageUrl: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Biểu mẫu' | 'Nghị quyết' | 'Hướng dẫn' | 'Khác';
  uploadDate: string;
  fileSize: string;
  downloadUrl: string;
  content?: string; // Simulated text content of the document
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
}

export interface QuizCompetition {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  questions: QuizQuestion[];
  timeLimitMinutes: number;
}

export interface AIResponse {
  text: string;
}
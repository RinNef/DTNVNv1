
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// NOTE: In a real production app, never expose API keys in frontend code.
// The key should ideally come from process.env.API_KEY.
// We are including the user-provided key here as a fallback for immediate usage.
const apiKey = process.env.API_KEY || 'AIzaSyANV8DveWlWQaT9Hun6Ff_CX1cXTjvoeb8'; 

const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION_ADMIN = `
Bạn là một trợ lý AI chuyên nghiệp hỗ trợ cán bộ Đoàn Thanh Niên viết bài, soạn thảo văn bản và lên ý tưởng hoạt động.
Văn phong cần trang trọng, nhiệt huyết, mang tính cổ vũ và phù hợp với giới trẻ Việt Nam.
`;

const SYSTEM_INSTRUCTION_LIBRARIAN = `
Bạn là một thủ thư thông thái của Thư viện Đoàn Thanh Niên. 
Nhiệm vụ của bạn là giới thiệu sách, tóm tắt nội dung sách và khuyến khích văn hóa đọc.
Hãy trả lời thân thiện, ngắn gọn và hữu ích.
`;

export const generateNewsContent = async (topic: string): Promise<string> => {
  if (!apiKey) return "Lỗi: Chưa cấu hình API Key.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy viết một bài báo ngắn (khoảng 200-300 từ) cho website Đoàn Thanh Niên về chủ đề: "${topic}". 
      Bài viết nên có tiêu đề hấp dẫn và chia thành các đoạn rõ ràng.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ADMIN,
        temperature: 0.7,
      }
    });
    return response.text || "Không thể tạo nội dung.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};

export const askLibrarian = async (query: string, contextData: string): Promise<string> => {
  if (!apiKey) return "Lỗi: Chưa cấu hình API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Dữ liệu sách hiện có: ${contextData}.
      
      Câu hỏi của người dùng: "${query}"
      
      Hãy trả lời câu hỏi dựa trên dữ liệu sách (nếu có liên quan) hoặc kiến thức chung về sách.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_LIBRARIAN,
        temperature: 0.5,
      }
    });
    return response.text || "Xin lỗi, tôi không thể trả lời lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};

export const generateEventPlan = async (eventName: string): Promise<string> => {
  if (!apiKey) return "Lỗi: Chưa cấu hình API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy lập một kế hoạch tóm tắt cho hoạt động Đoàn sau: "${eventName}".
      Nội dung cần bao gồm:
      1. Mục đích - Ý nghĩa
      2. Đối tượng tham gia
      3. Nội dung chính (Agenda)
      4. Dự trù kinh phí cơ bản
      Trình bày ngắn gọn, rõ ràng bằng Markdown.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ADMIN,
        temperature: 0.7,
      }
    });
    return response.text || "Không thể lập kế hoạch.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};

export const generateBookSummary = async (bookTitle: string, author: string): Promise<string> => {
  if (!apiKey) return "Lỗi: Chưa cấu hình API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Hãy tóm tắt ngắn gọn những nội dung chính (khoảng 3-5 ý gạch đầu dòng) của cuốn sách: "${bookTitle}" của tác giả "${author}". Nếu không biết chính xác sách này, hãy đưa ra mô tả chung về thể loại của nó.`,
      config: {
        systemInstruction: "Bạn là một chuyên gia review sách.",
        temperature: 0.6,
      }
    });
    return response.text || "Không thể tạo tóm tắt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
};

export const generateQuizQuestions = async (topic: string, count: number = 5): Promise<QuizQuestion[]> => {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tạo ${count} câu hỏi trắc nghiệm về chủ đề: "${topic}".`,
      config: {
        systemInstruction: "Bạn là người ra đề thi trắc nghiệm chính xác, khách quan. Trả về định dạng JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Nội dung câu hỏi" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Danh sách 4 phương án trả lời" 
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "Chỉ số của đáp án đúng trong mảng options (0-3)" 
              }
            },
            required: ["question", "options", "correctAnswerIndex"],
          }
        }
      }
    });

    if (response.text) {
      const rawQuestions = JSON.parse(response.text);
      // Add unique IDs
      return rawQuestions.map((q: any, index: number) => ({
        ...q,
        id: `gen_${Date.now()}_${index}`
      }));
    }
    return [];
  } catch (error) {
    console.error("Gemini API Quiz Error:", error);
    return [];
  }
};

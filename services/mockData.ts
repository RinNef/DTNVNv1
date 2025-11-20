
import { Book, BookCategory, NewsArticle, RentalRequest, YouthEvent, DocumentItem, QuizCompetition } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    author: 'Rosie Nguyễn',
    category: BookCategory.SKILLS,
    coverUrl: 'https://picsum.photos/300/450?random=1',
    available: 5,
    description: 'Cuốn sách giúp bạn trẻ định hướng và phát triển bản thân.',
    detailedSummary: '1. Tôi đã học như thế nào? - Phương pháp tự học và khám phá năng lực bản thân.\n2. Học đi đôi với hành - Tầm quan trọng của trải nghiệm thực tế.\n3. Đi là một cách học - Những bài học từ những chuyến đi.\n4. Lấp lánh trước khi tỏa sáng - Rèn luyện kỹ năng và thái độ sống tích cực.'
  },
  {
    id: 'b2',
    title: 'Nhật Ký Đặng Thùy Trâm',
    author: 'Đặng Thùy Trâm',
    category: BookCategory.HISTORY,
    coverUrl: 'https://picsum.photos/300/450?random=2',
    available: 3,
    description: 'Hồi ký đầy cảm xúc của nữ bác sĩ trong chiến tranh.',
    detailedSummary: 'Cuốn nhật ký ghi lại những suy nghĩ, cảm xúc của nữ bác sĩ Đặng Thùy Trâm trong những năm tháng gian khổ tại chiến trường Đức Phổ, Quảng Ngãi. Qua đó, người đọc thấy được lý tưởng sống cao đẹp, tình yêu quê hương đất nước và sự hy sinh thầm lặng của thế hệ thanh niên thời chiến.'
  },
  {
    id: 'b3',
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    category: BookCategory.SKILLS,
    coverUrl: 'https://picsum.photos/300/450?random=3',
    available: 10,
    description: 'Nghệ thuật thu phục lòng người.',
    detailedSummary: '- Nguyên tắc ứng xử căn bản: Không chỉ trích, oán trách hay than phiền.\n- 6 cách tạo thiện cảm: Biết lắng nghe, mỉm cười, nhớ tên người khác...\n- Cách hướng người khác theo suy nghĩ của mình.\n- Chuyển hóa người khác mà không gây ra sự chống đối hay oán giận.'
  },
  {
    id: 'b4',
    title: 'Lược Sử Nước Việt',
    author: 'Hiếu Minh',
    category: BookCategory.HISTORY,
    coverUrl: 'https://picsum.photos/300/450?random=4',
    available: 2,
    description: 'Lịch sử Việt Nam qua tranh vẽ sinh động.',
    detailedSummary: 'Tóm tắt lịch sử Việt Nam từ thời Hùng Vương dựng nước đến thời đại Hồ Chí Minh qua các tranh vẽ minh họa sinh động, dễ hiểu. Cuốn sách phù hợp cho mọi lứa tuổi muốn tìm hiểu nhanh về dòng chảy lịch sử hào hùng của dân tộc.'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Lễ ra quân Tháng Thanh Niên 2024',
    summary: 'Sáng nay, hàng nghìn đoàn viên đã tham gia lễ ra quân với khí thế sôi nổi.',
    content: 'Sáng ngày 26/02, tại Quảng trường trung tâm, lễ ra quân Tháng Thanh Niên 2024 đã diễn ra thành công tốt đẹp. Chương trình bao gồm các hoạt động trồng cây, dọn vệ sinh môi trường và thăm hỏi các gia đình chính sách. Đây là hoạt động thường niên nhằm phát huy tinh thần xung kích của tuổi trẻ.',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    date: '2024-02-26',
    author: 'Ban Tuyên Giáo'
  },
  {
    id: 'n2',
    title: 'Hội thi Tin học trẻ cấp thành phố',
    summary: 'Cuộc thi thu hút hơn 500 thí sinh tham dự với nhiều sản phẩm sáng tạo.',
    content: 'Hội thi Tin học trẻ năm nay ghi nhận sự gia tăng về số lượng và chất lượng các đề tài. Đặc biệt là các ứng dụng AI trong giáo dục và y tế được các em học sinh cấp 3 phát triển rất ấn tượng.',
    imageUrl: 'https://picsum.photos/800/400?random=11',
    date: '2024-03-10',
    author: 'Ban Thanh Thiếu Nhi'
  }
];

export const INITIAL_RENTALS: RentalRequest[] = [
  {
    id: 'r1',
    bookId: 'b1',
    bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    userName: 'Nguyễn Văn A',
    userEmail: 'ana@example.com',
    requestDate: '2024-05-01',
    status: 'pending'
  }
];

export const INITIAL_EVENTS: YouthEvent[] = [
  {
    id: 'e1',
    title: 'Chiến dịch Mùa Hè Xanh 2024',
    date: '2024-07-15',
    location: 'Huyện Củ Chi, TP.HCM',
    description: 'Tham gia xây cầu, dạy học và giúp đỡ bà con nông dân.',
    content: `### I. MỤC ĐÍCH – YÊU CẦU
1. Phát huy tinh thần xung kích, tình nguyện của thanh niên thành phố.
2. Tạo môi trường thực tiễn để đoàn viên, thanh niên rèn luyện, cống hiến và trưởng thành.

### II. NỘI DUNG HOẠT ĐỘNG
1. **Xây dựng nông thôn mới:** Bê tông hóa 500m đường giao thông nông thôn.
2. **An sinh xã hội:** Thăm và tặng quà 20 gia đình chính sách.
3. **Vì đàn em thân yêu:** Tổ chức sinh hoạt hè, dạy tiếng Anh cho 100 thiếu nhi.

### III. LỊCH TRÌNH
- **07:00 - 08:00:** Tập trung tại Nhà Văn hóa Thanh Niên.
- **08:00 - 09:30:** Di chuyển đến địa bàn.
- **09:30 - 11:30:** Lễ ra quân và nhận nhiệm vụ.
- **14:00 - 17:00:** Thực hiện công trình thanh niên.`,
    maxParticipants: 50,
    registeredCount: 32,
    registrations: [],
    imageUrl: 'https://picsum.photos/800/400?random=20'
  },
  {
    id: 'e2',
    title: 'Hiến máu tình nguyện: Giọt hồng yêu thương',
    date: '2024-04-20',
    location: 'Nhà Văn hóa Thanh Niên',
    description: 'Ngày hội hiến máu cứu người dành cho đoàn viên thanh niên.',
    content: `### Ý NGHĨA CHƯƠNG TRÌNH
"Một giọt máu cho đi - Một cuộc đời ở lại". Chương trình nhằm bổ sung nguồn máu dự trữ cho các bệnh viện thành phố.

### ĐỐI TƯỢNG THAM GIA
- Đoàn viên, thanh niên, sinh viên trên địa bàn thành phố.
- Có sức khỏe tốt, không mắc các bệnh truyền nhiễm.
- Cân nặng từ 45kg trở lên.

### QUYỀN LỢI
- Được khám và tư vấn sức khỏe miễn phí.
- Nhận giấy chứng nhận hiến máu tình nguyện.
- Nhận quà tặng và hỗ trợ chi phí đi lại theo quy định.`,
    maxParticipants: 200,
    registeredCount: 150,
    registrations: [],
    imageUrl: 'https://picsum.photos/800/400?random=21'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'd1',
    title: 'Điều lệ Đoàn TNCS Hồ Chí Minh',
    category: 'Hướng dẫn',
    uploadDate: '2023-12-01',
    fileSize: '2.5 MB',
    downloadUrl: '#',
    content: `ĐIỀU LỆ ĐOÀN THANH NIÊN CỘNG SẢN HỒ CHÍ MINH
(Đại hội đại biểu toàn quốc lần thứ XII thông qua ngày 15/12/2022)

Đoàn Thanh niên Cộng sản Hồ Chí Minh là tổ chức chính trị - xã hội của thanh niên Việt Nam do Đảng Cộng sản Việt Nam và Chủ tịch Hồ Chí Minh sáng lập, lãnh đạo và rèn luyện. Đoàn bao gồm những thanh niên tiên tiến, phấn đấu vì mục tiêu, lý tưởng của Đảng là độc lập dân tộc gắn liền với chủ nghĩa xã hội, dân giàu, nước mạnh, dân chủ, công bằng, văn minh.

CHƯƠNG I: ĐOÀN VIÊN

Điều 1:
1. Đoàn viên Đoàn Thanh niên Cộng sản Hồ Chí Minh là thanh niên Việt Nam tiên tiến, phấn đấu vì lý tưởng của Đảng Cộng sản Việt Nam và Chủ tịch Hồ Chí Minh, có tinh thần yêu nước, tự cường dân tộc; có lối sống lành mạnh, cần kiệm, trung thực; tích cực, gương mẫu trong học tập, lao động, hoạt động xã hội và bảo vệ Tổ quốc, gắn bó mật thiết với thanh niên; chấp hành nghiêm chỉnh pháp luật của Nhà nước và Điều lệ Đoàn.

Điều 2:
Thanh niên Việt Nam tuổi từ 16 đến 30, tích cực học tập, lao động và rèn luyện, tham gia các hoạt động xã hội, tự nguyện hoạt động trong một tổ chức cơ sở của Đoàn, thừa nhận Điều lệ Đoàn đều được xét kết nạp vào Đoàn.

... (Xem chi tiết trong file tải về)`
  },
  {
    id: 'd2',
    title: 'Mẫu đơn xin vào Đoàn (Sổ Đoàn viên)',
    category: 'Biểu mẫu',
    uploadDate: '2024-01-15',
    fileSize: '500 KB',
    downloadUrl: '#',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------

ĐƠN XIN VÀO ĐOÀN

Kính gửi: - Ban Chấp hành Chi đoàn: ..........................................................
          - Ban Chấp hành Đoàn trường/xã/phường: .....................................

Tôi tên là: .......................................................................................................
Sinh ngày: ........................................................................................................
Quê quán: ........................................................................................................
Nơi ở hiện nay: ..............................................................................................
Học sinh lớp / Công tác tại: ..........................................................................

Sau một thời gian tìm hiểu về Đoàn TNCS Hồ Chí Minh, tôi nhận thấy:
Đoàn TNCS Hồ Chí Minh là tổ chức chính trị - xã hội của thanh niên Việt Nam...

Tôi tự nguyện viết đơn này xin gia nhập vào Đoàn TNCS Hồ Chí Minh.
Nếu được đứng vào hàng ngũ của Đoàn, tôi xin hứa:
1. Suốt đời phấn đấu vì lý tưởng của Đảng và Bác Hồ.
2. Nghiêm chỉnh thực hiện Điều lệ Đoàn.
3. Tích cực học tập, lao động và rèn luyện...

Người làm đơn
(Ký và ghi rõ họ tên)`
  },
  {
    id: 'd3',
    title: 'Nghị quyết Đại hội Đoàn toàn quốc lần thứ XII',
    category: 'Nghị quyết',
    uploadDate: '2023-01-01',
    fileSize: '1.2 MB',
    downloadUrl: '#',
    content: `NGHỊ QUYẾT
ĐẠI HỘI ĐẠI BIỂU TOÀN QUỐC ĐOÀN TNCS HỒ CHÍ MINH
LẦN THỨ XII, NHIỆM KỲ 2022 - 2027

Đại hội đại biểu toàn quốc Đoàn TNCS Hồ Chí Minh lần thứ XII họp từ ngày 14 đến ngày 16 tháng 12 năm 2022 tại Thủ đô Hà Nội...

QUYẾT NGHỊ:

I. Tán thành những nội dung cơ bản về đánh giá kết quả thực hiện Nghị quyết Đại hội đại biểu toàn quốc Đoàn TNCS Hồ Chí Minh lần thứ XI, nhiệm kỳ 2017 - 2022.

II. Mục tiêu, nhiệm vụ, giải pháp công tác đoàn và phong trào thanh thiếu nhi nhiệm kỳ 2022 - 2027:
1. Khẩu hiệu hành động: "Khát vọng - Tiên phong - Đoàn kết - Bản lĩnh - Sáng tạo".
2. Các chỉ tiêu trọng tâm:
- 100% cán bộ đoàn, đoàn viên được học tập, quán triệt các nghị quyết của Đảng, của Đoàn.
- Hỗ trợ 5 triệu lượt thanh niên được tư vấn hướng nghiệp...

(Hết trích)`
  }
];

export const INITIAL_QUIZZES: QuizCompetition[] = [
  {
    id: 'q1',
    title: 'Tìm hiểu lịch sử Đoàn TNCS Hồ Chí Minh',
    description: 'Cuộc thi trắc nghiệm trực tuyến nhân kỷ niệm ngày thành lập Đoàn 26/3.',
    status: 'active',
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q1_1',
        question: 'Đoàn TNCS Hồ Chí Minh được thành lập vào ngày tháng năm nào?',
        options: ['26/03/1930', '26/03/1931', '03/02/1930', '19/05/1941'],
        correctAnswerIndex: 1
      },
      {
        id: 'q1_2',
        question: 'Người đoàn viên đầu tiên là ai?',
        options: ['Lý Tự Trọng', 'Võ Thị Sáu', 'Nguyễn Văn Trỗi', 'Kim Đồng'],
        correctAnswerIndex: 0
      }
    ]
  }
];
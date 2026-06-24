# DAT_LT_WEB2
🌟 Tổng quan về Hệ thống PawFund (System Overview)
Hệ thống PawFund được thiết kế theo mô hình hiện đại, chia làm 3 phần hoạt động độc lập nhưng liên kết chặt chẽ với nhau, giúp website chạy nhanh, bảo mật và dễ dàng nâng cấp:

1. Giao diện hiển thị (Frontend - React.js)

Vai trò: Là "mặt tiền" của nền tảng, nơi người dùng (người yêu động vật, trạm cứu hộ, quản trị viên) trực tiếp nhìn thấy và thao tác.
Nhiệm vụ: Cung cấp trải nghiệm mượt mà, từ việc lướt xem danh sách các bé chó mèo đang tìm nhà, đọc thông tin chiến dịch quyên góp, đến việc điền form đăng ký nhận nuôi. Mọi thao tác click chuột của bạn sẽ được Frontend tiếp nhận và gửi yêu cầu (API Request) xuống cho bộ phận xử lý.
2. Bộ não xử lý (Backend - Spring Boot)

Vai trò: Là "trạm trung chuyển và kiểm duyệt" đằng sau hậu trường.
Nhiệm vụ: Khi nhận được yêu cầu từ Frontend (ví dụ: có người muốn quyên góp 500k), Backend sẽ:
Kiểm tra bảo mật: Xem người này đã đăng nhập chưa, tài khoản có hợp lệ không.
Xử lý nghiệp vụ: Cập nhật số tiền vào quỹ của chiến dịch, ghi nhận lịch sử đóng góp.
Lưu trữ: Gửi lệnh xuống Database để cất giữ những thông tin vừa thay đổi này một cách an toàn.
3. Kho lưu trữ (Database - MySQL)

Vai trò: Là "két sắt" của hệ thống.
Nhiệm vụ: Lưu trữ toàn bộ dữ liệu như: thông tin hàng ngàn tài khoản, hồ sơ chi tiết của từng bé thú cưng (hình ảnh, tình trạng sức khỏe), lịch sử các giao dịch thiện nguyện, và các bài đăng tìm thú cưng đi lạc.
🔄 Ví dụ thực tế: Luồng hoạt động khi Nhận nuôi thú cưng (Adoption Flow)
Để dễ hình dung nhất, hãy xem qua hành trình một bé mèo tìm được chủ mới trên PawFund:

Gửi yêu cầu: Bạn lướt web (Frontend), say nắng một bé mèo và bấm nút "Gửi yêu cầu nhận nuôi".
Tiếp nhận & Lưu trữ: Frontend gửi thông tin của bạn xuống Backend. Backend kiểm tra xem bé mèo này có ai nhận chưa, sau đó tạo một "Đơn xin nhận nuôi" và cất vào Database với trạng thái Chờ duyệt.
Xét duyệt: Quản lý trạm cứu hộ đăng nhập vào hệ thống, kiểm tra danh sách đơn từ Database, gọi điện trao đổi với bạn và quyết định bấm "Duyệt đơn".
Cập nhật kết quả: Backend nhận lệnh duyệt, tiến hành đổi trạng thái của bé mèo trong Database thành Đã có chủ, đồng thời gửi thông báo thành công lên Frontend để chúc mừng bạn!

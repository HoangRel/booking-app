

# Hotel Management System


## Giới thiệu
Dự án này bao gồm một server backend NodeJS (chạy ở cổng 8080) và hai ứng dụng frontend ReactJS - một dành cho người dùng (chạy ở cổng 3000) và một dành cho quản trị viên (chạy ở cổng 3001).

## Các thành phần

1. **Server Backend:**
   - Đảm nhiệm các thao tác liên quan đến dữ liệu dưới Database.
   - Chạy ở Port 8080.

2. **Client App (Người Dùng):**
   - Frontend ReactJS cho người dùng.
   - Cho phép người dùng xem khách sạn, tìm kiếm, và đặt phòng.
   - Chạy ở Port 3000.

3. **Admin App (Quản Trị Viên):**
   - Frontend ReactJS cho quản trị viên.
   - Cung cấp các chức năng quản trị như thêm khách sạn, quản lý phòng, và giao dịch.
   - Chạy ở Port 3001.

## Liên kết Demo
- [Người Dùng](https://hotels--rrr.web.app/)

## Hướng dẫn khai thác

### Cài đặt

1. Clone repository về máy của bạn.
2. Di chuyển vào thư mục `server` và chạy lệnh `npm install`.
3. Di chuyển vào thư mục `client` và `admin`, sau đó chạy lệnh `npm install` trong từng thư mục.

### Khởi chạy

1. **Khởi chạy Server Backend:**
   - Di chuyển vào thư mục `server`.
   - Chạy lệnh `npm start` để khởi động server.

2. **Khởi chạy Client App (Người Dùng):**
   - Di chuyển vào thư mục `client`.
   - Chạy lệnh `npm start` để khởi động ứng dụng người dùng.

3. **Khởi chạy Admin App (Quản Trị Viên):**
   - Di chuyển vào thư mục `admin`.
   - Chạy lệnh `npm start` để khởi động ứng dụng quản trị viên.

4. **Truy cập ứng dụng:**
   - Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) cho ứng dụng người dùng, hoặc [http://localhost:3001](http://localhost:3001) cho ứng dụng quản trị viên.

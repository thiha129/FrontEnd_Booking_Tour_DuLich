# MERN Booking Tour

Ứng dụng đặt tour du lịch xây dựng với **MongoDB, Express, React, Node.js**.

## Cấu trúc dự án

```
MERN Booking Tour/
├── BackEnd_Booking_Tour_DuLich/   # API Express (port 4000)
└── FrontEnd_Booking_Tour_DuLich/   # React (port 3000)
```

## Yêu cầu

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) đang chạy (local hoặc Atlas)

## Cài đặt nhanh

### 1. Backend

```bash
cd BackEnd_Booking_Tour_DuLich
npm install
```

Tạo file `.env` (copy từ `.env.example`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/booking-tour
JWT_SECRET_KEY=your-long-random-secret-key
PORT=4000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

Chạy server:

```bash
npm run start-dev
```

### 2. Frontend

```bash
cd FrontEnd_Booking_Tour_DuLich
npm install
```

Tạo file `.env`:

```env
REACT_APP_API_URL=http://localhost:4000/api/v1
```

Chạy app:

```bash
npm start
```

Mở trình duyệt: **http://localhost:3000**

---

## Tạo tài khoản Admin

Admin cần `role: "admin"` trong MongoDB. Cách nhanh nhất: dùng script có sẵn.

### Cách 1 — Script tự động (khuyên dùng)

Trong thư mục backend (đã cấu hình `.env` với `MONGO_URI`):

```bash
cd BackEnd_Booking_Tour_DuLich
npm run create-admin
```

Mặc định tạo user:

| Trường | Giá trị |
|--------|---------|
| Username | `admin` |
| Email | `admin@travelbooking.com` |
| Password | `Admin@123` |

Tùy chỉnh:

```bash
npm run create-admin -- myadmin admin@email.com MyPassword123
```

Nếu username hoặc email đã tồn tại, script **nâng role lên admin** và đổi mật khẩu theo tham số.

### Cách 2 — MongoDB Compass / mongosh

1. Đăng ký user thường tại http://localhost:3000/register  
2. Mở collection `users`, tìm user vừa tạo  
3. Sửa field `role` từ `"user"` thành `"admin"`  
4. Đăng xuất và đăng nhập lại  

### Đăng nhập Admin

1. http://localhost:3000/login  
2. Dùng tài khoản admin  
3. Vào **Admin** trên menu hoặc http://localhost:3000/admin  

---

## Tính năng chính

- Duyệt tour, tìm kiếm, lọc, phân trang (URL `?page=2`)
- Chi tiết tour, gallery ảnh tự chuyển
- Đặt tour (giá: **$/người/đêm × số đêm × số khách + phí**)
- Đánh giá: **1 review / user / tour**, username lấy từ token
- Wishlist (localStorage)
- Admin: CRUD tour, user, booking, upload ảnh
- Đa ngôn ngữ Vi / En

## API chính

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/v1/auth/register` | Đăng ký |
| POST | `/api/v1/auth/login` | Đăng nhập (cookie) |
| GET | `/api/v1/tours` | Danh sách tour |
| GET | `/api/v1/tours/:id` | Chi tiết tour |
| POST | `/api/v1/booking` | Tạo booking (cần login) |
| POST | `/api/v1/review/:tourId` | Gửi review (cần login) |
| POST | `/api/v1/upload/single` | Upload ảnh (admin) |

## Ghi chú

- Thanh toán trên checkout là **giao diện demo**, chưa tích hợp cổng thanh toán thật.
- Ảnh upload lưu tại `BackEnd_Booking_Tour_DuLich/uploads/`.
- Production: đặt `NODE_ENV=production`, HTTPS, và `CORS_ORIGIN` trỏ đúng domain frontend.

## Scripts backend

| Lệnh | Mô tả |
|------|--------|
| `npm start` | Chạy production |
| `npm run start-dev` | Chạy với nodemon |
| `npm run create-admin` | Tạo / cập nhật user admin |

## Scripts frontend

| Lệnh | Mô tả |
|------|--------|
| `npm start` | Dev server :3000 |
| `npm run build` | Build production |

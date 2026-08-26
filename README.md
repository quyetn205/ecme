# 🛒 Fullstack E-Commerce Project

Dự án website thương mại điện tử Fullstack với giao diện hiện đại và Backend bảo mật cao.

## 🚀 Công nghệ sử dụng (Tech Stack)

### Frontend (`ecommerce-fe`)
*   **Framework:** React (Vite)
*   **Ngôn ngữ:** TypeScript
*   **Styling:** Tailwind CSS
*   **Quản lý State & Data Fetching:** Zustand, React Query (nếu có)
*   **Biểu đồ:** Recharts
*   **Routing:** React Router DOM

### Backend (`electronic-commerce`)
*   **Framework:** Java Spring Boot 3
*   **Phiên bản Java:** Java 21
*   **Bảo mật:** Spring Security, JWT (JSON Web Tokens), OAuth2 (Google Login)
*   **Tương tác CSDL:** Spring Data JPA / Hibernate
*   **Cơ sở dữ liệu:** MySQL
*   **Caching:** Redis

---

## 🛠️ Hướng dẫn cài đặt chạy ở máy tính (Local Development)

### 1. Yêu cầu hệ thống (Prerequisites)
*   Node.js (phiên bản 18+)
*   Java Development Kit (JDK 21)
*   MySQL Server (đang chạy cổng 3306)
*   Redis Server (đang chạy cổng 6379)

### 2. Cài đặt Backend
Mở Terminal, di chuyển vào thư mục `electronic-commerce`:
```bash
cd electronic-commerce
```
*   Tạo file `src/main/resources/application-local.yaml` dựa trên `application.yaml` để điền mật khẩu MySQL và các Secret Key của bạn. (File này đã được thiết lập để không đẩy lên GitHub).
*   Chạy ứng dụng bằng Maven:
```bash
./mvnw spring-boot:run
```
*(Backend sẽ chạy tại địa chỉ `http://localhost:8081`)*

### 3. Cài đặt Frontend
Mở một Terminal mới, di chuyển vào thư mục `ecommerce-fe`:
```bash
cd ecommerce-fe
```
*   Cài đặt thư viện:
```bash
npm install
```
*   Tạo file `.env.development` ở thư mục `ecommerce-fe` và thêm dòng sau:
```env
VITE_API_BASE_URL=http://localhost:8081
```
*   Chạy ứng dụng:
```bash
npm run dev
```
*(Frontend sẽ chạy tại địa chỉ `http://localhost:5173`)*

---

## ☁️ Thông tin Triển khai (Deployment)

Dự án được thiết lập để có thể deploy miễn phí một cách dễ dàng lên các nền tảng đám mây:

*   **Frontend:** Deploy trên [Vercel](https://vercel.com) (Đã có sẵn file `vercel.json` để cấu hình React Router).
*   **Backend:** Deploy trên [Render](https://render.com) (Đã có sẵn `Dockerfile` hỗ trợ build Java 21 cực nhanh).
*   **Database (MySQL):** Cấu hình sử dụng [Aiven.io](https://aiven.io/).
*   **Cache (Redis):** Cấu hình sử dụng [Upstash.com](https://upstash.com/).

> **Lưu ý:** Khi deploy Backend lên Render, hãy nhớ thêm đầy đủ các biến môi trường (Environment Variables) như `SPRING_DATASOURCE_URL`, `SPRING_DATA_REDIS_URL`, `JWT_SIGNER_KEY`, v.v.

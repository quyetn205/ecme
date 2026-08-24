# Tính năng Đăng nhập bằng Google (Google OAuth2)

## 1. Tổng quan
- **Mục đích:** Tính năng này cho phép người dùng đăng nhập hoặc đăng ký tài khoản mới tự động bằng tài khoản Google (Gmail) của họ mà không cần phải tự tạo username/password thủ công.
- **Nghiệp vụ hoạt động:** Hệ thống sử dụng quy trình **Authorization Code Flow**. Khi người dùng muốn đăng nhập, ứng dụng điều hướng họ sang trang xác thực của Google. Nếu họ đồng ý, Google sẽ trả về một mã `code`. Backend sẽ dùng mã này đổi lấy Access Token từ Google để đọc thông tin người dùng (Email, Tên), tự động tạo hoặc tìm người dùng trong Database, sau đó tự tạo ra JWT (JSON Web Token) của riêng hệ thống và cấp cho Frontend.
- **Tại sao cần thiết kế như vậy:** Việc Backend tự giữ Secret Key và tự giao tiếp với Google giúp bảo mật cao nhất (Frontend không giữ token nhạy cảm của Google). Hơn nữa, luồng này giúp đồng bộ hoàn toàn với cơ chế JWT (JSON Web Token) hiện tại của hệ thống.

---

## 2. Luồng hoạt động

Dưới đây là flow đầy đủ từ khi người dùng bấm nút đến khi đăng nhập thành công:

1. **Frontend:** Người dùng click vào nút "Đăng nhập với Google" -> URL thay đổi và gọi API `GET /auth/google/login` của Backend.
2. **Backend (Controller):** Trả về mã Redirect (302) để trình duyệt chuyển hướng người dùng sang trang **Google Consent Screen**.
3. **Google:** Người dùng chọn tài khoản và đồng ý cấp quyền -> Google chuyển hướng trình duyệt về lại Backend thông qua URL `GET /auth/google/callback?code=...`
4. **Backend (Service):** 
   - Lấy `code` từ URL, dùng `RestTemplate` gọi API của Google để đổi lấy Google Access Token.
   - Dùng Google Access Token gọi API `/oauth2/v3/userinfo` của Google để lấy thông tin (Email, Name).
   - Truy vấn DB: `UserRepository.findByEmail(email)`. 
      - Nếu đã có User -> Dùng luôn User đó (có thể họ từng đăng ký bằng Username/Pass).
      - Nếu chưa có -> Tạo mới User với role `USER`, `authProvider="GOOGLE"`, và random username.
   - Gọi `JwtService.generateToken(user)` để tạo ra JWT của hệ thống (như login bình thường).
   - Controller redirect trình duyệt về lại Frontend tại trang `http://localhost:5173/auth/callback?token=...`.
5. **Frontend (AuthCallbackPage):** Đọc JWT từ URL, lưu vào LocalStorage, gọi API `getMe()` để lấy thông tin, lưu vào Zustand store, cuối cùng chuyển hướng người dùng về trang chủ (Home).

---

## 3. Các file liên quan

### Backend
- `application.yaml`: Khai báo thông tin Client ID, Client Secret và cấu hình các URL của Google API.
- `AuthenticationController.java`: Mở ra 2 API công khai để Frontend gọi (`/google/login`) và Google gọi về (`/google/callback`).
- `GoogleAuthService.java`: Nơi chứa toàn bộ logic gọi Google API (đổi code lấy token, lấy thông tin user) và đồng bộ vào Database (Tìm/tạo User).
- `JwtService.java`: Class này được tách ra để tái sử dụng logic tạo chuỗi JWT. Cả quá trình đăng nhập bình thường (`AuthenticationService`) và đăng nhập Google đều phải dùng.
- `User.java` (Entity): Bổ sung thêm cột `authProvider` để đánh dấu tài khoản nào được tạo qua Google.
- `UserRepository.java`: Bổ sung hàm tìm kiếm user bằng email.

### Frontend
- `LoginForm.tsx`: Nơi chứa nút bấm giao diện để kích hoạt `/auth/google/login`.
- `AuthCallbackPage.tsx`: Trang đặc biệt đóng vai trò làm "trạm trung chuyển". Không có giao diện rõ ràng, nó chỉ dùng để hứng token từ URL do Backend ném về.
- `route-path.ts` và `index.tsx`: Khai báo đường dẫn `/auth/callback` trỏ tới `AuthCallbackPage`.

---

## 4. Code quan trọng

**1. Hàm `findOrCreateUser` trong `GoogleAuthService.java`**
```java
private User findOrCreateUser(GoogleUserInfo googleUserInfo) {
    String email = googleUserInfo.getEmail();
    return userRepository.findByEmail(email).orElseGet(() -> {
        // Tạo unique username
        String username = "google_" + email.replace("@", "_").replace(".", "_");
        
        Role userRole = roleRepository.findById(RoleEnum.USER.name())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));

        User newUser = User.builder()
                .username(username)
                .email(email)
                .fullName(googleUserInfo.getName())
                .status(true)
                .authProvider("GOOGLE") // Đánh dấu nguồn gốc
                .roles(Set.of(userRole))
                .build();
        return userRepository.save(newUser);
    });
}
```
*Giải thích:* 
- Hàm này cực kỳ quan trọng vì nó quyết định việc gộp tài khoản hay tạo mới. Nếu user từng đăng ký bằng email `abc@gmail.com` bằng mật khẩu, nay họ dùng Google Login (cùng email đó) thì hệ thống sẽ nhận diện và cho phép đăng nhập vào đúng tài khoản cũ mà không bị trùng lặp.
- Nếu xoá đi, hệ thống có thể tạo ra các tài khoản rác bị trùng email hoặc làm crash DB nếu cột email bị dính UNIQUE constraint.

**2. Bắt Token ở `AuthCallbackPage.tsx`**
```tsx
useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
        setToken(token); // Lưu localStorage
        userService.getMe().then((res) => {
            setAuth(token, res.result); // Cập nhật Global State
            navigate(ROUTE_PATH.HOME);
        });
    }
}, []);
```
*Giải thích:* 
- Đây là mắt xích cuối cùng nối liền Backend và Frontend. Backend nhét JWT vào URL (`?token=xyz...`), Frontend phải dùng trang này bắt lấy chuỗi `xyz...` đó và xử lý như một lần đăng nhập thành công.
- Nếu không có file này, Backend khi chạy xong không biết phải trả token cho ai, và Frontend cũng không cập nhật được trạng thái đăng nhập.

---

## 5. Backend

- **Entity & Repository:** `User` bổ sung thuộc tính `authProvider`. Việc này tuy nhỏ nhưng tốt cho Data Analytics và Debugging sau này. `UserRepository` bổ sung `findByEmail` làm cầu nối đồng bộ hoá.
- **DTO:** `GoogleTokenResponse` và `GoogleUserInfo` để ánh xạ JSON trả về từ Google thành Object Java thông qua thư viện Jackson (chú ý annotation `@JsonProperty`).
- **Service:** `GoogleAuthService` thực hiện tác vụ như 1 HTTP Client (Sử dụng `RestTemplate` để call API ngoài). Service này hoàn toàn độc lập với luồng xác thực User/Pass cũ.
- **Controller & Security:** Thêm Endpoint nhưng phải nhớ nới lỏng cấu hình Security (`PUBLIC_ENDPOINTS`) để tránh bị Filter chặn lại vì thiếu quyền. Exception trong luồng này (nếu có lỗi từ Google) sẽ được Controller `catch` và redirect thẳng về trang Login kèm Error Message (Thay vì trả JSON lỗi).

---

## 6. Frontend

- **Page Component (`AuthCallbackPage`):** Không có UI. Hiển thị chữ "Đang xử lý..." tạm thời.
- **Hooks:** Dùng `useSearchParams` của `react-router-dom` để móc lấy tham số trên URL.
- **State Management:** Sau khi lưu Token vào LocalStorage, hook phải tái sử dụng hành động `setAuth` (Zustand) để thông báo cho toàn bộ các Component khác (Header, Cart) biết rằng "Đã có người dùng login".
- **API Call:** Khác với luồng Login cũ là phải gọi API `POST /auth/token`, luồng mới chỉ việc gọi API `GET /users/my-info` thông qua `userService.getMe()` vì đã nắm sẵn Token trong tay.

---

## 7. API

| Method | Endpoint | Mục đích | Authentication | Request | Response |
| ------ | -------- | -------- | -------------- | ------- | -------- |
| GET | `/auth/google/login` | Frontend gọi để Backend Redirect sang Google. | Không cần | Trống | HTTP 302 (Redirect) |
| GET | `/auth/google/callback` | Cổng để Google gọi lại gửi kèm mã Authorization Code. | Không cần | `?code=abc...` | HTTP 302 (Về lại Frontend) |

---

## 8. Database

- **Bảng liên quan:** Chủ yếu thao tác trên bảng `user`. Bảng `role` và `user_roles` tham gia chỉ ở mức độ Read (lấy role mặc định) và Insert (Mapping User-Role).
- **Dữ liệu sinh ra:**
  - `username`: tự động generate `google_xxxx`.
  - `password`: `null` (Bảo mật: User Google không có mật khẩu trong DB nội bộ, nên không thể login qua đường User/Pass thông thường).
  - `authProvider`: Lưu giá trị `GOOGLE`.

---

## 9. Các trường hợp đặc biệt

- **Thành công:** Tìm thấy email (hoặc tạo mới), gen JWT, redirect về FE.
- **Người dùng bấm "Hủy" trên Google:** Google ném trả Callback với query param `?error=access_denied`. Controller sẽ bắt được chuỗi này, redirect FE về lại `/auth/login?error=google_denied`. Frontend hiện Toast báo "Đăng nhập Google bị hủy".
- **Backend call Google API thất bại (VD đứt mạng):** Controller nhảy vào khối `catch`, redirect về `/auth/login?error=google_failed`.
- **Dữ liệu không hợp lệ:** Người dùng không có Email (Rất hiếm nhưng có thể xảy ra tuỳ setting của Google Account). Code ném `AppException` và ngắt luồng.

---

## 10. Những điều tôi cần hiểu để có thể tự code lại

1. **OAuth2 Flow:** Phải hiểu nguyên lý cơ bản của OAuth2 Authorization Code. Nắm rõ vì sao cần `code`, vì sao `code` dùng đổi `access_token`, và tại sao không gửi luôn thông tin user về mà phải đi đường vòng (để tăng bảo mật).
2. **RestTemplate / WebClient:** Cách gọi một API REST (bên thứ ba) từ bên trong Spring Boot Backend. Cách set Header, set form-url-encoded.
3. **Mã hoá URL (URLEncoder):** Tại sao khi Backend redirect sang FE hoặc sang Google phải gọi `URLEncoder.encode(...)`. Tránh bị lỗi phá vỡ cú pháp URL.
4. **React Router & Query Params:** Cách lấy giá trị `?abc=123` từ thanh URL của trình duyệt thông qua Hook.
5. **Cookie vs URL Token:** Tại sao Frontend phải nhận Token bằng URL `?token=...` thay vì qua Body (Vì Redirect thì chỉ có GET Method và URL, không có Body).

---

## 11. Câu hỏi tự kiểm tra

Dưới đây là 10 câu hỏi để ôn tập:

1. Dựa trên luồng đã làm, khi người dùng bấm đăng nhập Google, Frontend có gửi API POST nào có chứa mật khẩu không?
2. Nhiệm vụ của hàm `exchangeCodeForToken` trong Backend là gì? Nó cần truyền đi những tham số nào?
3. Tại sao ở Backend cần có thuộc tính `google.redirect-uri` và URL này phải điền chính xác ở đâu trên web của Google?
4. Nếu tôi xoá thuộc tính `authProvider` trong class Entity `User`, ứng dụng có còn đăng nhập Google được không?
5. Đoạn mã nào trên Frontend chịu trách nhiệm hứng kết quả sau khi đăng nhập Google thành công?
6. Khi một người đã có tài khoản (username/password), nếu họ nhấn đăng nhập Google với email giống hệt, ứng dụng sẽ tạo tài khoản mới hay gộp chung? Hàm nào quyết định điều đó?
7. JWT token được sinh ra bởi Frontend, bởi Google, hay bởi Backend của ta? Giải thích lý do.
8. Nếu người dùng huỷ bỏ màn hình uỷ quyền của Google, thông báo "Hủy" sẽ được truyền từ Google về Backend rồi truyền về Frontend như thế nào?
9. `RestTemplate` trong Spring Boot dùng để làm gì trong tính năng này?
10. Tại sao tài khoản tạo bởi Google Login lại có trường `password` là `null`? Điều này có gây lỗi bảo mật không?

*(Hết)*

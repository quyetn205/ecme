# Frontend E-Commerce — Todo List

## Feature 1: Authentication ✅

- [x] 1. Tạo `src/features/auth/components/PasswordInput.tsx`
- [x] 2. Tạo `src/features/auth/components/LoginForm.tsx`
- [x] 3. Tạo `src/features/auth/components/RegisterForm.tsx`
- [x] 4. Tạo `src/features/auth/pages/LoginPage.tsx`
- [x] 5. Tạo `src/features/auth/pages/RegisterPage.tsx`
- [x] 6. Tạo `src/features/auth/hooks/useLogin.ts`
- [x] 7. Tạo `src/features/auth/hooks/useRegister.ts`
- [x] 8. Cập nhật `src/routes/index.tsx` (gắn pages vào routes)
- [x] 9. Build TypeScript (0 errors) + Production build (success)

## Feature 2: Product ✅

- [x] 1. Tạo `src/features/product/hooks/useProducts.ts` (list + pagination)
- [x] 2. Tạo `src/features/product/hooks/useProduct.ts` (get by id)
- [x] 3. Tạo `src/features/product/components/ProductCard.tsx`
- [x] 4. Tạo `src/features/product/components/ProductGrid.tsx`
- [x] 5. Tạo `src/features/product/components/ProductPagination.tsx`
- [x] 6. Tạo `src/features/product/pages/ProductListPage.tsx` (HOME route)
- [x] 7. Tạo `src/features/product/pages/ProductDetailPage.tsx` (/products/:id)
- [x] 8. Tạo `src/features/product/index.ts` (barrel export)
- [x] 9. Cập nhật `route-lazy.ts` + `routes/index.tsx`
- [x] 10. Build TypeScript (0 errors) + Production build (success)

## Feature 3: Cart ✅

- [x] 1. `useCart.ts` hook (React Query)
- [x] 2. `useAddToCart.ts` + `useUpdateQuantity.ts` hooks
- [x] 3. `CartPage.tsx` + `CartItemRow.tsx` + `CartSummary.tsx`
- [x] 4. Empty state + pagination fallback
- [x] 5. Cập nhật routes (`/cart` → CartPage)
- [x] 6. Wire `Add to Cart` from ProductListPage → `useAddToCart`
- [x] 7. `cart.store.ts` (Zustand) optimistic updates
- [x] 8. Build TypeScript (0 errors)

## Feature 4: Checkout & Order ✅

### Backend (thêm endpoint hủy đơn)

- [x] 1. `ErrorCode.java` — thêm `ORDER_CANNOT_CANCEL`
- [x] 2. `IOrderService.java` — thêm `cancelOrder(Long id)`
- [x] 3. `OrderService.java` — implement `cancelOrder` (check user + status + hoàn stock)
- [x] 4. `OrderController.java` — thêm `PATCH /{id}/cancel`

### Frontend

- [x] 5. `order.service.ts` — thêm `cancel(id)`
- [x] 6. `api-endpoint.constant.ts` — thêm `ORDER.CANCEL(id)`
- [x] 7. Hooks: `useCreateOrder`, `useOrders`, `useOrder`, `useCancelOrder`
- [x] 8. Components: `CheckoutForm`, `CheckoutSummary`, `OrderItemCard`, `OrderCard`, `OrderStatusBadge`, `OrderEmptyState`
- [x] 9. Pages: `CheckoutPage`, `OrderListPage`, `OrderDetailPage`
- [x] 10. Routes: cập nhật `route-lazy.ts` + `routes/index.tsx`
- [x] 11. `features/order/index.ts` barrel export
- [x] 12. Build verify (backend mvn + FE tsc/build)

## Feature 5: User Profile (Tiếp theo)

### Backend (mở rộng)

- [ ] 1. `ErrorCode.java` — thêm `PASSWORD_INCORRECT`, `EMAIL_EXISTED`
- [ ] 2. `UserUpdateRequest.java` — DTO mới (fullName, email, phone)
- [ ] 3. `ChangePasswordRequest.java` — DTO mới (oldPassword, newPassword)
- [ ] 4. `IUserService.java` — thêm `updateProfile`, `changePassword`
- [ ] 5. `UserService.java` — implement updateProfile + changePassword
- [ ] 6. `UserController.java` — thêm `PUT /users/me`, `PUT /users/me/password`

### Frontend

- [ ] 7. `user.type.ts` — thêm `UserUpdateRequest`, `ChangePasswordRequest`
- [ ] 8. `api-endpoint.constant.ts` — thêm `USER.UPDATE_ME`, `USER.CHANGE_PASSWORD`
- [ ] 9. `user.service.ts` — thêm `updateProfile`, `changePassword`
- [ ] 10. `validators.ts` — thêm `profileSchema`, `changePasswordSchema`
- [ ] 11. Hooks: `useProfile`, `useUpdateProfile`, `useChangePassword`
- [ ] 12. Components: `ProfileSummary`, `ProfileForm`, `ChangePasswordForm`
- [ ] 13. Page: `ProfilePage.tsx`
- [ ] 14. `features/user/index.ts` barrel export
- [ ] 15. Routes: cập nhật `route-lazy.ts` + `routes/index.tsx`
- [ ] 16. Build verify (backend mvn + FE tsc/build)

## Feature 6B: Product Management (Admin) ✅

### Backend (Hướng B — hỗ trợ upload ảnh khi update)

- [x] 1. `ProductController.java` — đổi `PUT /products/{id}` `@RequestBody` → `@ModelAttribute`
- [x] 2. `ProductService.java` — `updateProduct` thêm logic lưu ảnh mới + thêm `@PreAuthorize`
- [x] 3. `IProductService.java` — thêm `throws IOException` cho `updateProduct`

### Frontend

- [x] 4. `product.service.ts` — `update()` chuyển sang gửi FormData
- [x] 5. `useCreateProduct.ts` — hook mới
- [x] 6. `useUpdateProduct.ts` — hook mới
- [x] 7. `useDeleteProduct.ts` — hook mới
- [x] 8. `ProductFormModal.tsx` — form create/edit + upload ảnh + preview
- [x] 9. `AdminProductTable.tsx` — bảng CRUD + ConfirmDialog
- [x] 10. `ProductManagePage.tsx` — trang quản lý + modal + phân trang
- [x] 11. Wiring: `features/product/index.ts`, `route-lazy.ts`, `routes/index.tsx`
- [x] 12. Build verify (backend mvn compile OK + FE tsc/build success)

## Feature 6C: Role & Permission Management (Admin) ✅

- [x] 1. `useRoles.ts`, `useCreateRole.ts`, `useUpdateRole.ts`, `useDeleteRole.ts` hooks
- [x] 2. `usePermissions.ts`, `useCreatePermission.ts`, `useDeletePermission.ts` hooks
- [x] 3. `validators.ts` — thêm `permissionSchema`
- [x] 4. `RoleTable.tsx` — bảng CRUD role + ConfirmDialog
- [x] 5. `RoleFormModal.tsx` — form create/edit role + checkbox chọn permissions
- [x] 6. `PermissionTable.tsx` — bảng CRUD permission + ConfirmDialog
- [x] 7. `PermissionFormModal.tsx` — form tạo permission
- [x] 8. `RoleManagePage.tsx` — trang quản lý role
- [x] 9. `PermissionManagePage.tsx` — trang quản lý permission
- [x] 10. `features/admin/index.ts` barrel export
- [x] 11. Wiring: `route-lazy.ts` + `routes/index.tsx`
- [x] 12. Build verify — `npm run build` → built successfully (33.76s)
    - `RoleManagePage` chunk (9.07 kB)
    - `PermissionManagePage` chunk (6.41 kB)

## Feature 6D: Admin User Management ✅

### Backend (sửa để phục vụ FE)

- [x] 1. `UserResponse.java` — thêm `phone` + `roles: Set<String>` (role names, không lộ entity)
- [x] 2. `UserRoleResponse.java` — đổi `Set<Role>` entity → `Set<String>` (khớp FE `string[]`)
- [x] 3. `UserMapper.java` — thêm `@Mapping` populate `roles` (qua `roleNames()`), `userId` (từ `user.id`), `userName` (từ `user.username`)
- [x] 4. `UserController.java` — thêm `GET /users` (getAllUsers), `PUT /users/me` (updateProfile), `PUT /users/me/password` (changePassword)
- [x] 5. `IUserService.java` + `UserService.java` — thêm `getAllUsers()`, `updateProfile()`, `changePassword()` (đã có `@PreAuthorize("hasRole('ADMIN')")` cho getAllUsers & assignRoles)
- [x] 6. `ErrorCode.java` — bổ sung `PASSWORD_INCORRECT`, `EMAIL_EXISTED`, `ORDER_CANNOT_CANCEL`, sửa trùng code

### Frontend

- [x] 7. `user.type.ts` — `UserRoleResponse.roles: string[]` đồng bộ backend
- [x] 8. `api-endpoint.constant.ts` — thêm `USER.GET_ALL: '/users'`
- [x] 9. `user.service.ts` — thêm `getAll()`
- [x] 10. `useUsers.ts` — useQuery danh sách users
- [x] 11. `useAssignRoles.ts` — mutation `PUT /users/{id}/roles`
- [x] 12. `UserTable.tsx` — bảng users + role badges
- [x] 13. `AssignRoleModal.tsx` — modal checkbox chọn roles (dùng `useRoles`)
- [x] 14. `UserManagePage.tsx` — trang quản lý user tại `/admin/users`
- [x] 15. Wiring: `features/admin/index.ts`, `route-lazy.ts`, `routes/index.tsx`
- [x] 16. Build verify — Backend `mvn compile` exit 0 + FE `tsc -b --noEmit` exit 0

## Feature: Admin Navigation & Role-Based Access ✅

- [x] 1. Tạo `src/utils/jwt.ts` — decode JWT, lấy roles từ `scope` claim
- [x] 2. Sửa `src/utils/permission.ts` — `isAdmin()`/`hasRole()` thực sự check roles từ JWT
- [x] 3. Sửa `src/stores/auth.store.ts` — thêm `roles: string[]`, populate từ JWT khi login/initialize
- [x] 4. Sửa `src/routes/RoleGuard.tsx` — thực sự kiểm tra `allowedRoles`, redirect nếu không đủ quyền
- [x] 5. Sửa `src/layouts/UserLayout/Header.tsx` — hiện link "Quản trị" (Shield) khi user có role ADMIN
- [x] 6. Build verify — `npm run build` → built successfully (7.91s)

## Build Verification

- [x] `npx tsc -b --noEmit` → 0 errors
- [x] `npm run build` → built successfully (7.91s)
- [x] Code-splitting hoạt động:
    - `ProductListPage-DMXj-w5g.js` (5.52 kB)
    - `ProductDetailPage-7gDxu9Db.js` (2.33 kB)

## Giai đoạn 1: Sửa lỗi khẩn cấp (Emergency Bug Fixes) ✅

- [x] 1. `ProductDetailPage.tsx` — sửa `handleAddToCart` gọi mutation `useAddToCart` lưu database thay vì chỉ lưu local store Zustand; thêm loading state cho nút thêm giỏ hàng.
- [x] 2. `useCart.ts` + `Header.tsx` — hỗ trợ options `enabled` trong `useCart`; hiển thị badge số lượng sản phẩm trên icon giỏ hàng ở Header khi user đăng nhập.
- [x] 3. `CartService.java` — `getCartItems()` trả về danh sách rỗng `Collections.emptyList()` cho user mới chưa có Cart thay vì throw `NOT_PRODUCT_EXISTED`.
- [x] 4. `OrderRepository.java` — thêm từ khóa `distinct` vào các truy vấn `left join fetch` để tránh duplicate row các đối tượng Order.
- [x] 5. `SecurityConfig.java` — thu hẹp `PUBLIC_ENPOINTS`, chỉ cho phép `POST /users/register` và các method GET công khai; các endpoint user/admin khác bắt buộc qua xác thực.
- [x] 6. `GlobalExceptionHandler.java` + `ErrorCode.java` — thêm handler cho `AccessDeniedException` trả về HTTP 403 Forbidden thay vì lỗi 500; cập nhật `ErrorCode.UNAUTHORIZED` thành `HttpStatus.FORBIDDEN`.
- [x] 7. Build verification — Backend `mvn compile` exit 0 + Frontend `npm run build` exit 0 (6.87s).

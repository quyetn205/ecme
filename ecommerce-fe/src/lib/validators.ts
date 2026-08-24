import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự'),
    password: z.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự')
});

export const registerSchema = z
    .object({
        username: z.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự'),
        password: z.string().min(4, 'Mật khẩu phải có ít nhất 4 ký tự'),
        confirmPassword: z.string(),
        fullName: z.string().optional(),
        email: z
            .string()
            .email('Email không hợp lệ')
            .optional()
            .or(z.literal(''))
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
    });

export const productSchema = z.object({
    name: z.string().min(1, 'Tên sản phẩm không được để trống'),
    description: z.string().optional(),
    price: z.coerce.number().positive('Giá phải lớn hơn 0'),
    quantity: z.coerce.number().int().positive('Số lượng phải lớn hơn 0'),
    categoryId: z.coerce.number().optional()
});

export const orderSchema = z.object({
    fullName: z.string().min(1, 'Họ tên không được để trống'),
    phoneNumber: z
        .string()
        .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
    address: z.string().min(1, 'Địa chỉ không được để trống')
});

export const roleSchema = z.object({
    name: z.string().min(1, 'Tên role không được để trống'),
    description: z.string().optional(),
    permissions: z.array(z.string()).optional()
});

export const permissionSchema = z.object({
    name: z.string().min(1, 'Tên quyền không được để trống'),
    description: z.string().optional()
});

export const profileSchema = z.object({
    fullName: z.string().min(1, 'Họ tên không được để trống'),
    email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    phone: z
        .string()
        .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
        .optional()
        .or(z.literal(''))
});

export const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(4, 'Mật khẩu cũ phải có ít nhất 4 ký tự'),
        newPassword: z.string().min(4, 'Mật khẩu mới phải có ít nhất 4 ký tự'),
        confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: 'Mật khẩu mới phải khác mật khẩu cũ',
        path: ['newPassword']
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type PermissionFormData = z.infer<typeof permissionSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

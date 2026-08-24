import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validators';
import { useLogin } from '@/features/auth/hooks/useLogin';
import PasswordInput from '@/features/auth/components/PasswordInput';
import { ROUTE_PATH } from '@/routes/route-path';
import { env } from '@/configs';

const GOOGLE_LOGIN_URL = `${env.API_BASE_URL}/auth/google/login`;

export default function LoginForm() {
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
            noValidate
        >
            <div>
                <label
                    htmlFor='username'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Tên đăng nhập
                </label>
                <input
                    id='username'
                    type='text'
                    autoComplete='username'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='Nhập tên đăng nhập'
                    {...register('username')}
                />
                {errors.username && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.username.message}
                    </p>
                )}
            </div>

            <PasswordInput
                label='Mật khẩu'
                placeholder='Nhập mật khẩu'
                autoComplete='current-password'
                error={errors.password?.message}
                {...register('password')}
            />

            <button
                type='submit'
                disabled={loginMutation.isPending}
                className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
            >
                {loginMutation.isPending ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang đăng nhập...
                    </>
                ) : (
                    'Đăng nhập'
                )}
            </button>

            {/* Divider */}
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                    <span className='bg-white px-2 text-gray-500'>Hoặc</span>
                </div>
            </div>

            {/* Google Login */}
            <a
                href={GOOGLE_LOGIN_URL}
                id='google-login-btn'
                className='flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
                {/* Google SVG icon */}
                <svg width='18' height='18' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.328 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z' fill='#FFC107'/>
                    <path d='M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z' fill='#FF3D00'/>
                    <path d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.302 0-9.516-3.312-11.282-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z' fill='#4CAF50'/>
                    <path d='M43.611 20.083H42V20H24v8h11.303a11.812 11.812 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z' fill='#1976D2'/>
                </svg>
                Đăng nhập với Google
            </a>

            <p className='mt-4 text-center text-sm text-gray-600'>
                Chưa có tài khoản?{' '}
                <Link
                    to={ROUTE_PATH.REGISTER}
                    className='font-medium text-blue-600 hover:text-blue-500'
                >
                    Đăng ký ngay
                </Link>
            </p>
        </form>
    );
}

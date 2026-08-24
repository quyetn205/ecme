import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/lib/validators';
import { useRegister } from '@/features/auth/hooks/useRegister';
import PasswordInput from '@/features/auth/components/PasswordInput';
import { ROUTE_PATH } from '@/routes/route-path';

export default function RegisterForm() {
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            fullName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data);
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
                    placeholder='Tối thiểu 4 ký tự'
                    {...register('username')}
                />
                {errors.username && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.username.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor='fullName'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Họ và tên
                </label>
                <input
                    id='fullName'
                    type='text'
                    autoComplete='name'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='Nhập họ và tên'
                    {...register('fullName')}
                />
                {errors.fullName && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.fullName.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor='email'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Email
                </label>
                <input
                    id='email'
                    type='email'
                    autoComplete='email'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='example@email.com'
                    {...register('email')}
                />
                {errors.email && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.email.message}
                    </p>
                )}
            </div>

            <PasswordInput
                label='Mật khẩu'
                placeholder='Tối thiểu 4 ký tự'
                autoComplete='new-password'
                error={errors.password?.message}
                {...register('password')}
            />

            <PasswordInput
                label='Xác nhận mật khẩu'
                id='confirmPassword'
                placeholder='Nhập lại mật khẩu'
                autoComplete='new-password'
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            <button
                type='submit'
                disabled={registerMutation.isPending}
                className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
            >
                {registerMutation.isPending ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang đăng ký...
                    </>
                ) : (
                    'Đăng ký'
                )}
            </button>

            <p className='mt-4 text-center text-sm text-gray-600'>
                Đã có tài khoản?{' '}
                <Link
                    to={ROUTE_PATH.LOGIN}
                    className='font-medium text-blue-600 hover:text-blue-500'
                >
                    Đăng nhập
                </Link>
            </p>
        </form>
    );
}

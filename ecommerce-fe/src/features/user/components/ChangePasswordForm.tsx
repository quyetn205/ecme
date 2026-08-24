import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validators';
import { useChangePassword } from '@/features/user/hooks/useChangePassword';

export default function ChangePasswordForm() {
    const changePassword = useChangePassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePassword.mutate(
            {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            },
            {
                onSuccess: () => {
                    reset();
                }
            }
        );
    };

    const inputClass =
        'w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
            noValidate
        >
            <div>
                <label
                    htmlFor='oldPassword'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Mật khẩu cũ
                </label>
                <input
                    id='oldPassword'
                    type='password'
                    className={inputClass}
                    placeholder='Nhập mật khẩu hiện tại'
                    autoComplete='current-password'
                    {...register('oldPassword')}
                />
                {errors.oldPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.oldPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor='newPassword'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Mật khẩu mới
                </label>
                <input
                    id='newPassword'
                    type='password'
                    className={inputClass}
                    placeholder='Nhập mật khẩu mới'
                    autoComplete='new-password'
                    {...register('newPassword')}
                />
                {errors.newPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.newPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor='confirmPassword'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Xác nhận mật khẩu mới
                </label>
                <input
                    id='confirmPassword'
                    type='password'
                    className={inputClass}
                    placeholder='Nhập lại mật khẩu mới'
                    autoComplete='new-password'
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <div className='pt-2'>
                <button
                    type='submit'
                    disabled={changePassword.isPending}
                    className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
                >
                    {changePassword.isPending ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Đang đổi...
                        </>
                    ) : (
                        'Đổi mật khẩu'
                    )}
                </button>
            </div>
        </form>
    );
}

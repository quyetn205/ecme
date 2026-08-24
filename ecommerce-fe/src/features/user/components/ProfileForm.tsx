import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { profileSchema, ProfileFormData } from '@/lib/validators';
import { useUpdateProfile } from '@/features/user/hooks/useUpdateProfile';
import { UserResponse } from '@/types';

interface ProfileFormProps {
    user: UserResponse;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const updateProfile = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || ''
        }
    });

    // Reset form when user data changes (e.g. after update)
    useEffect(() => {
        reset({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || ''
        });
    }, [user, reset]);

    const onSubmit = (data: ProfileFormData) => {
        const payload = {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone
        };
        updateProfile.mutate(payload);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
            noValidate
        >
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
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='Nhập email'
                    {...register('email')}
                />
                {errors.email && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor='phone'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Số điện thoại
                </label>
                <input
                    id='phone'
                    type='tel'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='Nhập số điện thoại'
                    {...register('phone')}
                />
                {errors.phone && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.phone.message}
                    </p>
                )}
            </div>

            <div className='pt-2'>
                <button
                    type='submit'
                    disabled={updateProfile.isPending || !isDirty}
                    className='flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
                >
                    {updateProfile.isPending ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Đang lưu...
                        </>
                    ) : (
                        'Lưu thay đổi'
                    )}
                </button>
            </div>
        </form>
    );
}

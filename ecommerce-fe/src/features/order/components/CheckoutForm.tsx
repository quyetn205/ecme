import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { orderSchema, OrderFormData } from '@/lib/validators';

interface CheckoutFormProps {
    onSubmit: (data: OrderFormData) => void;
    isSubmitting: boolean;
}

export default function CheckoutForm({
    onSubmit,
    isSubmitting
}: CheckoutFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            address: ''
        }
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'
            noValidate
        >
            <h2 className='text-lg font-semibold text-gray-900'>
                Thông tin giao hàng
            </h2>

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
                    htmlFor='phoneNumber'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Số điện thoại
                </label>
                <input
                    id='phoneNumber'
                    type='tel'
                    autoComplete='tel'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='VD: 0912345678'
                    {...register('phoneNumber')}
                />
                {errors.phoneNumber && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.phoneNumber.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor='address'
                    className='mb-1 block text-sm font-medium text-gray-700'
                >
                    Địa chỉ giao hàng
                </label>
                <textarea
                    id='address'
                    rows={3}
                    autoComplete='street-address'
                    className='w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='Nhập địa chỉ giao hàng'
                    {...register('address')}
                />
                {errors.address && (
                    <p className='mt-1 text-sm text-red-600'>
                        {errors.address.message}
                    </p>
                )}
            </div>

            <button
                type='submit'
                disabled={isSubmitting}
                className='flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang đặt hàng...
                    </>
                ) : (
                    'Đặt hàng'
                )}
            </button>
        </form>
    );
}

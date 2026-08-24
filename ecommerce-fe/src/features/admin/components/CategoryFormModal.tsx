import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
import { useCreateCategory } from '@/features/category/hooks/useCreateCategory';
import { useUpdateCategory } from '@/features/category/hooks/useUpdateCategory';
import { CategoryResponse } from '@/types';

const categorySchema = z.object({
    name: z.string().min(1, 'Tên danh mục không được để trống'),
    description: z.string().optional()
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    category?: CategoryResponse | null;
}

export default function CategoryFormModal({
    open,
    onClose,
    category
}: CategoryFormModalProps) {
    const isEdit = !!category;
    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name ?? '',
            description: category?.description ?? ''
        }
    });

    useEffect(() => {
        if (open) {
            reset({
                name: category?.name ?? '',
                description: category?.description ?? ''
            });
        }
    }, [open, category, reset]);

    if (!open) return null;

    const isLoading = createCategory.isPending || updateCategory.isPending;

    const onSubmit = (data: CategoryFormData) => {
        if (isEdit && category) {
            updateCategory.mutate(
                { id: category.id, data },
                { onSuccess: onClose }
            );
        } else {
            createCategory.mutate(data, { onSuccess: onClose });
        }
    };

    const inputClass =
        'w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
                <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>
                        {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                    </h3>
                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-md p-1 text-gray-500 hover:bg-gray-100'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <label
                            htmlFor='name'
                            className='mb-1 block text-sm font-medium text-gray-700'
                        >
                            Tên danh mục
                        </label>
                        <input
                            id='name'
                            type='text'
                            className={inputClass}
                            placeholder='Nhập tên danh mục'
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className='mt-1 text-sm text-red-600'>
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor='description'
                            className='mb-1 block text-sm font-medium text-gray-700'
                        >
                            Mô tả
                        </label>
                        <textarea
                            id='description'
                            rows={3}
                            className={inputClass}
                            placeholder='Nhập mô tả'
                            {...register('description')}
                        />
                    </div>

                    <div className='mt-6 flex justify-end gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            disabled={isLoading}
                            className='rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            Hủy
                        </button>
                        <button
                            type='submit'
                            disabled={isLoading}
                            className='flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            {isLoading && (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            )}
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

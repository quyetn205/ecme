import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { productSchema, ProductFormData } from '@/lib/validators';
import { useCreateProduct } from '@/features/product/hooks/useCreateProduct';
import { useUpdateProduct } from '@/features/product/hooks/useUpdateProduct';
import { useCategories } from '@/features/category/hooks/useCategories';
import { ProductResponse } from '@/types';
import FileUpload from '@/components/common/FileUpload';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    product?: ProductResponse | null;
}

export default function ProductFormModal({
    open,
    onClose,
    product
}: ProductFormModalProps) {
    const isEdit = !!product;
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const { data: categoriesData } = useCategories();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const categories = categoriesData?.result ?? [];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name ?? '',
            description: product?.description ?? '',
            price: product?.price ?? 0,
            quantity: product?.quantity ?? 0,
            categoryId: product?.category?.id
        }
    });

    // Reset form when modal opens / product changes
    useEffect(() => {
        if (open) {
            reset({
                name: product?.name ?? '',
                description: product?.description ?? '',
                price: product?.price ?? 0,
                quantity: product?.quantity ?? 0,
                categoryId: product?.category?.id
            });
            setSelectedFile(null);
        }
    }, [open, product, reset]);

    if (!open) return null;

    const isLoading = createProduct.isPending || updateProduct.isPending;

    const onSubmit = (data: ProductFormData) => {
        const payload = {
            name: data.name,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            categoryId: data.categoryId,
            image: selectedFile ?? undefined
        };

        if (isEdit && product) {
            updateProduct.mutate(
                { id: product.id, data: payload },
                { onSuccess: onClose }
            );
        } else {
            createProduct.mutate(payload, { onSuccess: onClose });
        }
    };

    const inputClass =
        'w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
    };

    const previewUrl = selectedFile
        ? URL.createObjectURL(selectedFile)
        : product?.image;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
                <div className='mb-4 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold'>
                        {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
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
                            Tên sản phẩm
                        </label>
                        <input
                            id='name'
                            type='text'
                            className={inputClass}
                            placeholder='Nhập tên sản phẩm'
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
                            htmlFor='categoryId'
                            className='mb-1 block text-sm font-medium text-gray-700'
                        >
                            Danh mục
                        </label>
                        <select
                            id='categoryId'
                            className={inputClass}
                            {...register('categoryId')}
                        >
                            <option value=''>Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <p className='mt-1 text-sm text-red-600'>
                                {errors.categoryId.message}
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
                            placeholder='Nhập mô tả sản phẩm'
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className='mt-1 text-sm text-red-600'>
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label
                                htmlFor='price'
                                className='mb-1 block text-sm font-medium text-gray-700'
                            >
                                Giá (VND)
                            </label>
                            <input
                                id='price'
                                type='number'
                                min={0}
                                className={inputClass}
                                placeholder='0'
                                {...register('price')}
                            />
                            {errors.price && (
                                <p className='mt-1 text-sm text-red-600'>
                                    {errors.price.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor='quantity'
                                className='mb-1 block text-sm font-medium text-gray-700'
                            >
                                Số lượng
                            </label>
                            <input
                                id='quantity'
                                type='number'
                                min={0}
                                className={inputClass}
                                placeholder='0'
                                {...register('quantity')}
                            />
                            {errors.quantity && (
                                <p className='mt-1 text-sm text-red-600'>
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Hình ảnh
                        </label>
                        <div className='flex items-start gap-4'>
                            <FileUpload
                                onChange={handleFileChange}
                                preview={previewUrl}
                                label={
                                    isEdit
                                        ? 'Thay đổi hình ảnh'
                                        : 'Chọn hình ảnh'
                                }
                                accept='image/*'
                            />
                            {selectedFile && (
                                <p className='mt-2 text-xs text-gray-500'>
                                    {selectedFile.name}
                                </p>
                            )}
                        </div>
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

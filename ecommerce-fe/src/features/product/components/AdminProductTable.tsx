import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ProductResponse } from '@/types';
import { formatCurrency } from '@/lib';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useDeleteProduct } from '@/features/product/hooks/useDeleteProduct';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores';
import { isAdmin } from '@/utils/permission';

interface AdminProductTableProps {
    products: ProductResponse[];
    onEdit: (product: ProductResponse) => void;
}

export default function AdminProductTable({
    products,
    onEdit
}: AdminProductTableProps) {
    const deleteProduct = useDeleteProduct();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { user } = useAuthStore();
    const isUserAdmin = isAdmin(user);

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        deleteProduct.mutate(deleteId, {
            onSuccess: () => setDeleteId(null)
        });
    };

    return (
        <>
            <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                Ảnh
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                Tên sản phẩm
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                Danh mục
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                Giá
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                Số lượng
                            </th>
                            <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500'>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {products.map((product) => (
                            <tr key={product.id} className='hover:bg-gray-50'>
                                <td className='px-4 py-3'>
                                    <div className='h-12 w-12 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shrink-0'>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className='h-full w-full object-cover'
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=SP';
                                                }}
                                            />
                                        ) : (
                                            <div className='flex h-full w-full items-center justify-center text-xs text-gray-400 font-medium'>
                                                N/A
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>
                                    {product.name}
                                </td>
                                <td className='px-4 py-3'>
                                    {product.category?.name ? (
                                        <span className='inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100'>
                                            {product.category.name}
                                        </span>
                                    ) : (
                                        <span className='text-xs text-gray-400 italic'>Chưa phân loại</span>
                                    )}
                                </td>
                                <td className='px-4 py-3 text-sm font-bold text-gray-900'>
                                    {formatCurrency(product.price)}
                                </td>

                                <td className='px-4 py-3'>
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                                            product.quantity <= 0
                                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : product.quantity <= 5
                                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full',
                                                product.quantity <= 0
                                                    ? 'bg-rose-500'
                                                    : product.quantity <= 5
                                                      ? 'bg-amber-500'
                                                      : 'bg-emerald-500'
                                            )}
                                        />
                                        {product.quantity <= 0
                                            ? 'Hết hàng'
                                            : product.quantity <= 5
                                              ? `Sắp hết (${product.quantity})`
                                              : `Còn ${product.quantity}`}
                                    </span>
                                </td>

                                <td className='px-4 py-3'>
                                    <div className='flex justify-end gap-2'>
                                        <button
                                            type='button'
                                            onClick={() => onEdit(product)}
                                            className='rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                            title='Chỉnh sửa'
                                        >
                                            <Pencil className='h-4 w-4' />
                                        </button>
                                        {isUserAdmin && (
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    setDeleteId(product.id)
                                                }
                                                className='rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600'
                                                title='Xóa'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                open={deleteId !== null}
                title='Xóa sản phẩm'
                message='Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.'
                confirmText='Xóa'
                cancelText='Hủy'
                variant='danger'
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </>
    );
}

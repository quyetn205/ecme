import { Edit2, Trash2 } from 'lucide-react';
import { CategoryResponse } from '@/types';
import { useDeleteCategory } from '@/features/category/hooks/useDeleteCategory';

interface CategoryTableProps {
    categories: CategoryResponse[];
    onEdit: (category: CategoryResponse) => void;
}

export default function CategoryTable({ categories, onEdit }: CategoryTableProps) {
    const deleteCategory = useDeleteCategory();

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            deleteCategory.mutate(id);
        }
    };

    return (
        <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 text-sm'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900'>
                                ID
                            </th>
                            <th className='whitespace-nowrap px-4 py-3 text-left font-medium text-gray-900'>
                                Tên danh mục
                            </th>
                            <th className='px-4 py-3 text-left font-medium text-gray-900'>
                                Mô tả
                            </th>
                            <th className='whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900'>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {categories.map((category) => (
                            <tr key={category.id} className='hover:bg-gray-50'>
                                <td className='whitespace-nowrap px-4 py-3 text-gray-900'>
                                    {category.id}
                                </td>
                                <td className='whitespace-nowrap px-4 py-3 font-medium text-gray-900'>
                                    {category.name}
                                </td>
                                <td className='px-4 py-3 text-gray-700'>
                                    {category.description || '-'}
                                </td>
                                <td className='whitespace-nowrap px-4 py-3 text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <button
                                            type='button'
                                            onClick={() => onEdit(category)}
                                            className='rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600'
                                            title='Sửa'
                                        >
                                            <Edit2 className='h-4 w-4' />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleDelete(category.id)}
                                            className='rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600'
                                            title='Xóa'
                                            disabled={deleteCategory.isPending}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

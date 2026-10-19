import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useCategories } from '@/features/category/hooks/useCategories';
import CategoryTable from '@/features/admin/components/CategoryTable';
import CategoryFormModal from '@/features/admin/components/CategoryFormModal';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import EmptyState from '@/components/common/EmptyState';
import { CategoryResponse } from '@/types';

export default function CategoryManagePage() {
    const { data, isLoading, isError, refetch } = useCategories();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

    const categories = data?.result ?? [];

    const handleAdd = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const handleEdit = (category: CategoryResponse) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        Quản lý danh mục
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Tổng cộng {categories.length} danh mục
                    </p>
                </div>
                <button
                    type='button'
                    onClick={handleAdd}
                    className='flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95'
                >
                    <Layers className='h-4 w-4' />
                    Thêm danh mục
                </button>
            </div>

            {isLoading ? (
                <LoadingFallback />
            ) : isError ? (
                <ErrorFallback
                    message='Không thể tải danh sách danh mục'
                    onRetry={refetch}
                />
            ) : categories.length === 0 ? (
                <EmptyState
                    title='Chưa có danh mục'
                    description='Nhấn "Thêm danh mục" để bắt đầu tạo danh mục đầu tiên.'
                />
            ) : (
                <CategoryTable categories={categories} onEdit={handleEdit} />
            )}

            <CategoryFormModal
                open={modalOpen}
                onClose={handleClose}
                category={editingCategory}
            />
        </div>
    );
}

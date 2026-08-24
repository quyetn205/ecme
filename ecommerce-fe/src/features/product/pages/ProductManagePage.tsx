import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { useProducts } from '@/features/product/hooks/useProducts';
import AdminProductTable from '@/features/product/components/AdminProductTable';
import ProductFormModal from '@/features/product/components/ProductFormModal';
import ProductPagination from '@/features/product/components/ProductPagination';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import EmptyState from '@/components/common/EmptyState';
import { ProductResponse } from '@/types';
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS
} from '@/constants';

export default function ProductManagePage() {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState<ProductResponse | null>(null);

    const { data, isLoading, isError, refetch } = useProducts({
        page,
        size,
        sortBy: 'id',
        sortDir: 'asc'
    });

    const products = data?.result?.content ?? [];
    const totalPages = data?.result?.totalPages ?? 0;
    const totalElements = data?.result?.totalElements ?? 0;

    const handleAdd = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleEdit = (product: ProductResponse) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSize(Number(e.target.value));
        setPage(0);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        Quản lý sản phẩm
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Tổng cộng {totalElements} sản phẩm
                    </p>
                </div>
                <button
                    type='button'
                    onClick={handleAdd}
                    className='flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700'
                >
                    <PackagePlus className='h-4 w-4' />
                    Thêm sản phẩm
                </button>
            </div>

            {isLoading ? (
                <LoadingFallback />
            ) : isError ? (
                <ErrorFallback
                    message='Không thể tải danh sách sản phẩm'
                    onRetry={refetch}
                />
            ) : products.length === 0 ? (
                <EmptyState
                    title='Chưa có sản phẩm'
                    description='Nhấn "Thêm sản phẩm" để bắt đầu tạo sản phẩm đầu tiên.'
                />
            ) : (
                <>
                    <AdminProductTable
                        products={products}
                        onEdit={handleEdit}
                    />

                    <div className='mt-4 flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <span>Hiển thị</span>
                            <select
                                value={size}
                                onChange={handleSizeChange}
                                className='rounded-md border border-gray-300 px-2 py-1'
                            >
                                {PAGE_SIZE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <span>mỗi trang</span>
                        </div>

                        <ProductPagination
                            page={data?.result?.page ?? 0}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}

            <ProductFormModal
                open={modalOpen}
                onClose={handleClose}
                product={editingProduct}
            />
        </div>
    );
}

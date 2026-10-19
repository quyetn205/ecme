import { useState, useEffect } from 'react';
import { PackagePlus, Search, X, PackageSearch } from 'lucide-react';
import { useProducts } from '@/features/product/hooks/useProducts';
import { useCategories } from '@/features/category/hooks/useCategories';
import { useDebounce } from '@/hooks';
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
    const [searchInput, setSearchInput] = useState('');
    const debouncedKeyword = useDebounce(searchInput, 400);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] =
        useState<ProductResponse | null>(null);

    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.result ?? [];

    // Reset page to 0 when search keyword or category changes
    useEffect(() => {
        setPage(0);
    }, [debouncedKeyword, categoryId]);

    const { data, isLoading, isError, refetch } = useProducts({
        page,
        size,
        sortBy: 'id',
        sortDir: 'asc',
        keyword: debouncedKeyword.trim() || undefined,
        categoryId: categoryId || undefined
    });

    const products = data?.result?.content ?? [];
    const totalPages = data?.result?.totalPages ?? 0;
    const totalElements = data?.result?.totalElements ?? 0;
    const isFiltered = !!debouncedKeyword.trim() || categoryId !== undefined;

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

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value ? Number(e.target.value) : undefined;
        setCategoryId(val);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setCategoryId(undefined);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        Quản lý sản phẩm
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        {isFiltered
                            ? `Tìm thấy ${totalElements} sản phẩm phù hợp`
                            : `Tổng cộng ${totalElements} sản phẩm trong hệ thống`}
                    </p>
                </div>
                <button
                    type='button'
                    onClick={handleAdd}
                    className='flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95'
                >
                    <PackagePlus className='h-4 w-4' />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Filter Bar */}
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xs'>
                {/* Search Input */}
                <div className='relative flex-1'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                        <Search className='h-4 w-4 text-gray-400' />
                    </div>
                    <input
                        type='text'
                        placeholder='Tìm theo tên sản phẩm...'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className='w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-9 py-2 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all'
                    />
                    {searchInput && (
                        <button
                            type='button'
                            onClick={() => setSearchInput('')}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                            title='Xóa tìm kiếm'
                        >
                            <X className='h-4 w-4' />
                        </button>
                    )}
                </div>

                {/* Category Select */}
                <div className='sm:w-60'>
                    <select
                        value={categoryId ?? ''}
                        onChange={handleCategoryChange}
                        className='w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm font-medium text-gray-700 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all'
                    >
                        <option value=''>Tất cả danh mục</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset button if filtered */}
                {isFiltered && (
                    <button
                        type='button'
                        onClick={handleClearFilters}
                        className='flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all'
                    >
                        <X className='h-3.5 w-3.5' />
                        Đặt lại
                    </button>
                )}
            </div>

            {isLoading ? (
                <LoadingFallback />
            ) : isError ? (
                <ErrorFallback
                    message='Không thể tải danh sách sản phẩm'
                    onRetry={refetch}
                />
            ) : products.length === 0 ? (
                isFiltered ? (
                    <EmptyState
                        icon={<PackageSearch className='h-16 w-16 text-gray-300' />}
                        title='Không tìm thấy sản phẩm'
                        description={`Không có sản phẩm nào khớp với từ khóa "${searchInput}" hoặc danh mục đã chọn.`}
                        action={
                            <button
                                type='button'
                                onClick={handleClearFilters}
                                className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all'
                            >
                                <X className='h-4 w-4' />
                                Xóa bộ lọc
                            </button>
                        }
                    />
                ) : (
                    <EmptyState
                        title='Chưa có sản phẩm'
                        description='Nhấn "Thêm sản phẩm" để bắt đầu tạo sản phẩm đầu tiên.'
                        action={
                            <button
                                type='button'
                                onClick={handleAdd}
                                className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all'
                            >
                                <PackagePlus className='h-4 w-4' />
                                Thêm sản phẩm
                            </button>
                        }
                    />
                )
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


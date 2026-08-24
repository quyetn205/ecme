import { useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { useProducts } from '@/features/product/hooks/useProducts';
import { useCategories } from '@/features/category/hooks/useCategories';
import ProductGrid from '@/features/product/components/ProductGrid';
import ProductPagination from '@/features/product/components/ProductPagination';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import EmptyState from '@/components/common/EmptyState';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { ProductResponse } from '@/types';
import { cn } from '@/lib/cn';
import {
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_DIR
} from '@/constants';
import { toast } from 'react-hot-toast';

export default function ProductListPage() {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [minPriceInput, setMinPriceInput] = useState<string>('');
    const [maxPriceInput, setMaxPriceInput] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [keywordInput, setKeywordInput] = useState<string>('');
    const [keyword, setKeyword] = useState<string | undefined>(undefined);

    const { data, isLoading, isError, refetch } = useProducts({
        page,
        size,
        sortBy: DEFAULT_SORT_BY,
        sortDir: DEFAULT_SORT_DIR,
        categoryId,
        minPrice,
        maxPrice,
        keyword
    });

    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.result ?? [];

    const addToCart = useAddToCart();

    const handleAddToCart = (product: ProductResponse) => {
        addToCart.mutate({
            productId: product.id,
            quantity: 1
        });
    };

    const applyPriceFilter = () => {
        const min = minPriceInput ? Number(minPriceInput) : undefined;
        const max = maxPriceInput ? Number(maxPriceInput) : undefined;

        if (min !== undefined && max !== undefined && min > max) {
            toast.error('Giá từ không được lớn hơn giá đến');
            return;
        }

        setMinPrice(min);
        setMaxPrice(max);
        setPage(DEFAULT_PAGE);
    };

    const clearFilters = () => {
        setCategoryId(undefined);
        setMinPriceInput('');
        setMaxPriceInput('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setKeywordInput('');
        setKeyword(undefined);
        setPage(DEFAULT_PAGE);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setKeyword(keywordInput.trim() || undefined);
        setPage(DEFAULT_PAGE);
    };

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const products = data?.result?.content ?? [];
    const totalPages = data?.result?.totalPages ?? 0;

    return (
        <div>
            <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Sản phẩm</h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Danh sách sản phẩm của cửa hàng
                    </p>
                </div>
                
                <form onSubmit={handleSearch} className='flex w-full max-w-sm items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm border border-gray-200'>
                    <PackageSearch className='ml-2 h-5 w-5 text-gray-400' />
                    <input
                        type='text'
                        placeholder='Tìm kiếm sản phẩm...'
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        className='w-full border-none bg-transparent px-2 py-1 text-sm outline-none'
                    />
                    <button type="submit" className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                        Tìm
                    </button>
                </form>
            </div>

            {categories.length > 0 && (
                <div className='mb-6 space-y-4'>
                    <div className='flex flex-wrap items-center gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium text-gray-700'>Danh mục:</span>
                            <div className='flex flex-wrap gap-2'>
                                <button
                                    onClick={() => {
                                        setCategoryId(undefined);
                                        setPage(DEFAULT_PAGE);
                                    }}
                                    className={cn(
                                        'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                        categoryId === undefined
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                >
                                    Tất cả
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setCategoryId(category.id);
                                            setPage(DEFAULT_PAGE);
                                        }}
                                        className={cn(
                                            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                            categoryId === category.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        )}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-4'>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm font-medium text-gray-700'>Khoảng giá:</span>
                            <input
                                type='number'
                                placeholder='Giá từ'
                                value={minPriceInput}
                                onChange={(e) => setMinPriceInput(e.target.value)}
                                className='w-32 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                            <span className='text-gray-500'>-</span>
                            <input
                                type='number'
                                placeholder='Giá đến'
                                value={maxPriceInput}
                                onChange={(e) => setMaxPriceInput(e.target.value)}
                                className='w-32 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                        </div>
                        <button
                            onClick={applyPriceFilter}
                            className='rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800'
                        >
                            Áp dụng
                        </button>
                        <button
                            onClick={clearFilters}
                            className='rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            )}

            {products.length === 0 ? (
                <EmptyState
                    icon={<PackageSearch className='h-16 w-16 text-gray-300' />}
                    title='Chưa có sản phẩm nào'
                    description='Cửa hàng chưa có sản phẩm nào để hiển thị.'
                />
            ) : (
                <>
                    <ProductGrid
                        products={products}
                        onAddToCart={handleAddToCart}
                    />
                    <ProductPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}

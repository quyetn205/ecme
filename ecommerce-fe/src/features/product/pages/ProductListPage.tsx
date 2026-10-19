import { useState } from 'react';
import { PackageSearch, Sparkles, ArrowDown, Filter, RotateCcw, Zap } from 'lucide-react';
import { useProducts } from '@/features/product/hooks/useProducts';
import { useCategories } from '@/features/category/hooks/useCategories';
import ProductGrid from '@/features/product/components/ProductGrid';
import ProductPagination from '@/features/product/components/ProductPagination';
import ProductSkeletonGrid from '@/features/product/components/ProductSkeletonGrid';
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

const PRICE_PRESETS = [
    { label: 'Tất cả giá', min: undefined, max: undefined },
    { label: '< 2 triệu', min: 0, max: 2000000 },
    { label: '2 - 5 triệu', min: 2000000, max: 5000000 },
    { label: '5 - 15 triệu', min: 5000000, max: 15000000 },
    { label: '> 15 triệu', min: 15000000, max: undefined }
];

export default function ProductListPage() {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [size] = useState(DEFAULT_PAGE_SIZE);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [minPriceInput, setMinPriceInput] = useState<string>('');
    const [maxPriceInput, setMaxPriceInput] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [keywordInput, setKeywordInput] = useState<string>('');
    const [keyword, setKeyword] = useState<string | undefined>(undefined);
    const [showCustomPrice, setShowCustomPrice] = useState(false);

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

    const handleSelectPreset = (min?: number, max?: number) => {
        setMinPrice(min);
        setMaxPrice(max);
        setMinPriceInput(min !== undefined ? String(min) : '');
        setMaxPriceInput(max !== undefined ? String(max) : '');
        setPage(DEFAULT_PAGE);
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
        setShowCustomPrice(false);
        setPage(DEFAULT_PAGE);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setKeyword(keywordInput.trim() || undefined);
        setPage(DEFAULT_PAGE);
    };

    if (isError) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const products = data?.result?.content ?? [];
    const totalPages = data?.result?.totalPages ?? 0;

    return (
        <div className='space-y-8'>
            {/* Hero Section */}
            <section className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16'>
                {/* Decorative glow circles */}
                <div className='pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl' />
                <div className='pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl' />

                <div className='relative z-10 max-w-2xl space-y-4'>
                    <div className='inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md'>
                        <Sparkles className='h-3.5 w-3.5 text-blue-400' />
                        Bộ Sưu Tập Công Nghệ Mới 2026
                    </div>
                    <h1 className='text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-tight'>
                        Nâng Tầm Trải Nghiệm <br />
                        <span className='bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent'>
                            Thiết Bị Đỉnh Cao
                        </span>
                    </h1>
                    <p className='text-sm sm:text-base text-gray-300/90 leading-relaxed'>
                        Khám phá các dòng Smartphone, Laptop & Phụ kiện thông minh chính hãng với chế độ bảo hành 12 tháng và hỗ trợ trả góp 0%.
                    </p>
                    <div className='pt-2 flex flex-wrap items-center gap-3'>
                        <a
                            href='#product-section'
                            className='inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-xl active:scale-95'
                        >
                            <Zap className='h-4 w-4' />
                            Xem Sản Phẩm
                            <ArrowDown className='h-4 w-4' />
                        </a>
                        <span className='text-xs text-gray-400 font-medium'>
                            🔥 Miễn phí vận chuyển đơn từ 500k
                        </span>
                    </div>
                </div>
            </section>

            {/* Product Section Header & Search */}
            <div id='product-section' className='scroll-mt-24 space-y-6'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h2 className='text-2xl font-extrabold text-gray-900 tracking-tight'>
                            Danh Mục Sản Phẩm
                        </h2>
                        <p className='mt-1 text-sm text-gray-500'>
                            Tìm kiếm và lựa chọn sản phẩm công nghệ phù hợp nhất
                        </p>
                    </div>

                    {/* Search Form */}
                    <form
                        onSubmit={handleSearch}
                        className='flex w-full sm:w-80 items-center gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all'
                    >
                        <PackageSearch className='ml-2.5 h-4 w-4 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Tìm tên sản phẩm...'
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            className='w-full border-none bg-transparent px-2 py-1 text-sm text-gray-900 outline-none placeholder:text-gray-400'
                        />
                        <button
                            type='submit'
                            className='rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95'
                        >
                            Tìm
                        </button>
                    </form>
                </div>

                {/* Categories & Price Filter Toolbar */}
                <div className='space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs'>
                    {/* Category Pills */}
                    {categories.length > 0 && (
                        <div className='flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar'>
                            <span className='shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1'>
                                Ngành hàng:
                            </span>
                            <button
                                onClick={() => {
                                    setCategoryId(undefined);
                                    setPage(DEFAULT_PAGE);
                                }}
                                className={cn(
                                    'shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200',
                                    categoryId === undefined
                                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
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
                                        'shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200',
                                        categoryId === category.id
                                            ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                                    )}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Quick Price Range Filters */}
                    <div className='flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-3'>
                        <div className='flex flex-wrap items-center gap-2 text-xs'>
                            <span className='font-semibold uppercase tracking-wider text-gray-400 mr-1'>
                                Mức giá:
                            </span>
                            {PRICE_PRESETS.map((preset, idx) => {
                                const isSelected =
                                    minPrice === preset.min && maxPrice === preset.max;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectPreset(preset.min, preset.max)}
                                        className={cn(
                                            'rounded-lg px-3 py-1 font-medium transition-all',
                                            isSelected
                                                ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        )}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setShowCustomPrice(!showCustomPrice)}
                                className='inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-gray-500 hover:text-gray-800'
                            >
                                <Filter className='h-3 w-3' />
                                {showCustomPrice ? 'Ẩn tùy chọn' : 'Tùy chỉnh'}
                            </button>
                        </div>

                        {(categoryId !== undefined || minPrice !== undefined || maxPrice !== undefined || keyword) && (
                            <button
                                onClick={clearFilters}
                                className='inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors'
                            >
                                <RotateCcw className='h-3 w-3' />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>

                    {/* Custom Price Range Expandable */}
                    {showCustomPrice && (
                        <div className='flex flex-wrap items-center gap-3 rounded-xl bg-gray-50/80 p-3 text-xs animate-in fade-in'>
                            <span className='font-medium text-gray-600'>Nhập khoảng giá (VNĐ):</span>
                            <input
                                type='number'
                                placeholder='Từ'
                                value={minPriceInput}
                                onChange={(e) => setMinPriceInput(e.target.value)}
                                className='w-28 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                            <span className='text-gray-400'>-</span>
                            <input
                                type='number'
                                placeholder='Đến'
                                value={maxPriceInput}
                                onChange={(e) => setMaxPriceInput(e.target.value)}
                                className='w-28 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                            <button
                                onClick={applyPriceFilter}
                                className='rounded-lg bg-gray-900 px-3 py-1 font-semibold text-white hover:bg-gray-800'
                            >
                                Áp dụng
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Grid or Skeleton */}
                {isLoading ? (
                    <ProductSkeletonGrid count={8} />
                ) : products.length === 0 ? (
                    <EmptyState
                        icon={<PackageSearch className='h-16 w-16 text-gray-300' />}
                        title='Không tìm thấy sản phẩm'
                        description='Hãy thử tìm với từ khóa khác hoặc xóa bớt bộ lọc giá.'
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
        </div>
    );
}

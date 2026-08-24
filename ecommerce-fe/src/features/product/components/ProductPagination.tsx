import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ProductPagination({
    page,
    totalPages,
    onPageChange
}: ProductPaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div className='mt-8 flex items-center justify-center gap-1'>
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0}
                className='inline-flex items-center rounded-md border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
                <ChevronLeft className='h-4 w-4' />
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        p === page
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {p + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className='inline-flex items-center rounded-md border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
                <ChevronRight className='h-4 w-4' />
            </button>
        </div>
    );
}

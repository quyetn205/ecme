import { useState } from 'react';
import { Star, MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { useProductReviews } from '@/features/product/hooks/useProductReviews';
import { useCreateReview } from '@/features/product/hooks/useCreateReview';
import { ROUTE_PATH } from '@/routes/route-path';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/formatters';

interface ProductReviewProps {
    productId: number;
}

export default function ProductReview({ productId }: ProductReviewProps) {
    const { isAuthenticated } = useAuthStore();
    const { data, isLoading } = useProductReviews(productId);
    const createReview = useCreateReview();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const reviews = data?.content ?? [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        createReview.mutate(
            { productId, rating, comment },
            {
                onSuccess: () => {
                    setRating(0);
                    setComment('');
                }
            }
        );
    };

    return (
        <div className='mt-12 rounded-lg bg-white p-6 shadow-sm border border-gray-100'>
            <h3 className='mb-6 flex items-center gap-2 text-xl font-bold text-gray-900'>
                <MessageCircle className='h-6 w-6 text-primary' />
                Đánh giá khách hàng
            </h3>

            {/* Review Form */}
            <div className='mb-10 rounded-lg bg-gray-50 p-6'>
                {!isAuthenticated ? (
                    <div className='text-center'>
                        <p className='mb-4 text-gray-600'>
                            Vui lòng đăng nhập để gửi đánh giá của bạn về sản
                            phẩm này.
                        </p>
                        <Link
                            to={ROUTE_PATH.LOGIN}
                            className='inline-block rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90'
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h4 className='mb-4 font-semibold text-gray-800'>
                            Viết đánh giá của bạn
                        </h4>
                        <div className='mb-4 flex items-center gap-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type='button'
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className='p-1 focus:outline-none'
                                >
                                    <Star
                                        className={cn(
                                            'h-6 w-6 transition-colors',
                                            (hoverRating || rating) >= star
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        )}
                                    />
                                </button>
                            ))}
                            <span className='ml-2 text-sm text-gray-500'>
                                {rating > 0 ? `${rating} sao` : 'Chọn số sao'}
                            </span>
                        </div>
                        <div className='mb-4'>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder='Chia sẻ cảm nhận của bạn về sản phẩm này...'
                                className='w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                                rows={3}
                            ></textarea>
                        </div>
                        <button
                            type='submit'
                            disabled={rating === 0 || createReview.isPending}
                            className='rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            {createReview.isPending
                                ? 'Đang gửi...'
                                : 'Gửi đánh giá'}
                        </button>
                    </form>
                )}
            </div>

            {/* Review List */}
            <div>
                <h4 className='mb-4 font-semibold text-gray-800'>
                    Các đánh giá mới nhất
                </h4>
                {isLoading ? (
                    <div className='py-4 text-center text-gray-500'>
                        Đang tải đánh giá...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className='py-8 text-center text-gray-500'>
                        Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu
                        tiên đánh giá!
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className='flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0'
                            >
                                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200'>
                                    <User className='h-5 w-5 text-gray-500' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold text-gray-900'>
                                            {review.fullName || review.username}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            • {formatDate(review.createdAt)}
                                        </span>
                                    </div>
                                    <div className='mt-1 flex items-center'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    'h-4 w-4',
                                                    review.rating >= star
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {review.comment && (
                                        <p className='mt-2 text-sm text-gray-700'>
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

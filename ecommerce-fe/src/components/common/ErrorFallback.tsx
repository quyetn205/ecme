import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorFallback({
    message = 'Đã có lỗi xảy ra.',
    onRetry
}: ErrorFallbackProps) {
    return (
        <div className='flex min-h-[60vh] flex-col items-center justify-center'>
            <AlertTriangle className='h-12 w-12 text-red-500' />
            <p className='mt-4 text-lg font-medium text-gray-900'>{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className='mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90'
                >
                    Thử lại
                </button>
            )}
        </div>
    );
}

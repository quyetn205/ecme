import { Loader2 } from 'lucide-react';

export default function LoadingFallback() {
    return (
        <div className='flex min-h-[60vh] items-center justify-center'>
            <div className='text-center'>
                <Loader2 className='mx-auto h-8 w-8 animate-spin text-primary' />
                <p className='mt-2 text-sm text-gray-500'>Đang tải...</p>
            </div>
        </div>
    );
}

import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    onConfirm,
    onCancel,
    variant = 'danger'
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
                <div className='flex items-center gap-3'>
                    <AlertTriangle
                        className={`h-6 w-6 ${
                            variant === 'danger'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                        }`}
                    />
                    <h3 className='text-lg font-semibold'>{title}</h3>
                </div>
                <p className='mt-3 text-sm text-gray-600'>{message}</p>
                <div className='mt-6 flex justify-end gap-3'>
                    <button
                        onClick={onCancel}
                        className='rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-md px-4 py-2 text-sm text-white ${
                            variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-primary hover:bg-primary/90'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

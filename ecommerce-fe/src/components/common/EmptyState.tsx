import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    icon,
    title = 'Không có dữ liệu',
    description,
    action
}: EmptyStateProps) {
    return (
        <div className='flex min-h-[40vh] flex-col items-center justify-center'>
            {icon || <Inbox className='h-16 w-16 text-gray-300' />}
            <h3 className='mt-4 text-lg font-medium text-gray-900'>{title}</h3>
            {description && (
                <p className='mt-1 text-sm text-gray-500'>{description}</p>
            )}
            {action && <div className='mt-6'>{action}</div>}
        </div>
    );
}

import { Link } from 'react-router-dom';
import { PackageOpen, ArrowLeft } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import { ROUTE_PATH } from '@/routes/route-path';

export default function OrderEmptyState() {
    return (
        <EmptyState
            icon={<PackageOpen className='h-16 w-16 text-gray-300' />}
            title='Chưa có đơn hàng nào'
            description='Bạn chưa đặt hàng. Hãy khám phá sản phẩm và đặt hàng ngay!'
            action={
                <Link
                    to={ROUTE_PATH.HOME}
                    className='inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Mua sắm ngay
                </Link>
            }
        />
    );
}

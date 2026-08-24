import { UserCircle2, Mail, Phone, User } from 'lucide-react';
import { UserResponse } from '@/types';

interface ProfileSummaryProps {
    user: UserResponse;
}

export default function ProfileSummary({ user }: ProfileSummaryProps) {
    const infoItems = [
        {
            icon: User,
            label: 'Họ và tên',
            value: user.fullName || 'Chưa cập nhật'
        },
        {
            icon: Mail,
            label: 'Email',
            value: user.email || 'Chưa cập nhật'
        },
        {
            icon: Phone,
            label: 'Số điện thoại',
            value: user.phone || 'Chưa cập nhật'
        }
    ];

    return (
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                    <UserCircle2 className='h-10 w-10 text-blue-600' />
                </div>
                <div>
                    <h2 className='text-lg font-semibold text-gray-900'>
                        {user.fullName || user.username}
                    </h2>
                    <p className='text-sm text-gray-500'>@{user.username}</p>
                </div>
            </div>

            <div className='mt-6 space-y-4'>
                {infoItems.map((item) => (
                    <div key={item.label} className='flex items-center gap-3'>
                        <item.icon className='h-5 w-5 text-gray-400' />
                        <div>
                            <p className='text-xs text-gray-500'>
                                {item.label}
                            </p>
                            <p className='text-sm font-medium text-gray-900'>
                                {item.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

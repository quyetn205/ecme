import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useProfile } from '@/features/user/hooks/useProfile';
import ProfileSummary from '@/features/user/components/ProfileSummary';
import ProfileForm from '@/features/user/components/ProfileForm';
import ChangePasswordForm from '@/features/user/components/ChangePasswordForm';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import { cn } from '@/lib/cn';

type TabKey = 'info' | 'password';

export default function ProfilePage() {
    const { data: profile, isLoading, isError, refetch } = useProfile();
    const [activeTab, setActiveTab] = useState<TabKey>('info');

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError || !profile) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
        { key: 'info', label: 'Thông tin cá nhân', icon: User },
        { key: 'password', label: 'Đổi mật khẩu', icon: Lock }
    ];

    return (
        <div>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>
                    Tài khoản của tôi
                </h1>
                <p className='mt-1 text-sm text-gray-500'>
                    Quản lý thông tin cá nhân và bảo mật
                </p>
            </div>

            <div className='grid gap-8 lg:grid-cols-3'>
                <div>
                    <ProfileSummary user={profile} />
                </div>

                <div className='lg:col-span-2'>
                    <div className='mb-4 flex gap-2 border-b border-gray-200'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type='button'
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    'inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                                    activeTab === tab.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                )}
                            >
                                <tab.icon className='h-4 w-4' />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className='rounded-lg border border-gray-200 bg-white p-6'>
                        {activeTab === 'info' ? (
                            <ProfileForm user={profile} />
                        ) : (
                            <ChangePasswordForm />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

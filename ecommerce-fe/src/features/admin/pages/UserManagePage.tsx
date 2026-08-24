import { useState } from 'react';
import { Users } from 'lucide-react';
import { useUsers } from '@/features/admin/hooks/useUsers';
import UserTable from '@/features/admin/components/UserTable';
import AssignRoleModal from '@/features/admin/components/AssignRoleModal';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import EmptyState from '@/components/common/EmptyState';
import { UserResponse } from '@/types';

export default function UserManagePage() {
    const { data, isLoading, isError, refetch } = useUsers();
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const users = data?.result ?? [];

    const handleAssignRoles = (user: UserResponse) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        Quản lý người dùng
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Tổng cộng {users.length} người dùng
                    </p>
                </div>
            </div>

            {isLoading ? (
                <LoadingFallback />
            ) : isError ? (
                <ErrorFallback
                    message='Không thể tải danh sách người dùng'
                    onRetry={refetch}
                />
            ) : users.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <Users className='h-12 w-12 text-gray-300' />
                    <h3 className='mt-4 text-lg font-semibold text-gray-900'>
                        Chưa có người dùng
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                        Danh sách người dùng sẽ xuất hiện ở đây.
                    </p>
                </div>
            ) : (
                <UserTable users={users} onAssignRoles={handleAssignRoles} />
            )}

            <AssignRoleModal
                open={modalOpen}
                onClose={handleClose}
                user={selectedUser}
            />
        </div>
    );
}

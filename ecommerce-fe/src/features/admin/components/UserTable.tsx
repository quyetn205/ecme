import { ShieldCheck, UserCog } from 'lucide-react';
import { UserResponse } from '@/types';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores/auth.store';

interface UserTableProps {
    users: UserResponse[];
    onAssignRoles: (user: UserResponse) => void;
}

const ROLE_STYLES: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    EMPLOYEE: 'bg-green-100 text-green-700',
    USER: 'bg-blue-100 text-blue-700'
};

export default function UserTable({ users, onAssignRoles }: UserTableProps) {
    const currentUser = useAuthStore((state) => state.user);

    return (
        <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                            ID
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                            Tên đăng nhập
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                            Họ tên
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                            Email
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                            Vai trò
                        </th>
                        <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500'>
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {users.map((user) => (
                        <tr key={user.id} className='hover:bg-gray-50'>
                            <td className='px-4 py-3 text-sm text-gray-500'>
                                #{user.id}
                            </td>
                            <td className='px-4 py-3 text-sm font-medium text-gray-900'>
                                {user.username}
                            </td>
                            <td className='px-4 py-3 text-sm text-gray-600'>
                                {user.fullName || '—'}
                            </td>
                            <td className='px-4 py-3 text-sm text-gray-600'>
                                {user.email || '—'}
                            </td>
                            <td className='px-4 py-3'>
                                <div className='flex flex-wrap gap-1'>
                                    {user.roles?.length ? (
                                        user.roles.map((role) => (
                                            <span
                                                key={role}
                                                className={cn(
                                                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                                                    ROLE_STYLES[role] ??
                                                        'bg-gray-100 text-gray-700'
                                                )}
                                            >
                                                <ShieldCheck className='h-3 w-3' />
                                                {role}
                                            </span>
                                        ))
                                    ) : (
                                        <span className='text-xs text-gray-400'>
                                            Không có
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className='px-4 py-3'>
                                <div className='flex justify-end'>
                                    <button
                                        type='button'
                                        onClick={() => onAssignRoles(user)}
                                        disabled={user.id === currentUser?.id}
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium',
                                            user.id === currentUser?.id
                                                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                                : 'text-blue-600 hover:bg-blue-50'
                                        )}
                                    >
                                        <UserCog className='h-4 w-4' />
                                        Gán vai trò
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

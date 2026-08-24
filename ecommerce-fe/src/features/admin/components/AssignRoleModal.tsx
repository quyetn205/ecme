import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useAssignRoles } from '@/features/admin/hooks/useAssignRoles';
import { useRoles } from '@/features/admin/hooks/useRoles';
import { UserResponse } from '@/types';
import { cn } from '@/lib/cn';

interface AssignRoleModalProps {
    open: boolean;
    onClose: () => void;
    user: UserResponse | null;
}

export default function AssignRoleModal({
    open,
    onClose,
    user
}: AssignRoleModalProps) {
    const assignRoles = useAssignRoles();
    const { data: rolesData, isLoading: rolesLoading } = useRoles();
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const allRoles = rolesData?.result ?? [];

    useEffect(() => {
        if (open && user) {
            setSelectedRoles(user.roles ?? []);
        }
    }, [open, user]);

    if (!open || !user) return null;

    const toggleRole = (name: string) => {
        setSelectedRoles((prev) =>
            prev.includes(name)
                ? prev.filter((r) => r !== name)
                : [...prev, name]
        );
    };

    const handleSubmit = () => {
        assignRoles.mutate(
            { userId: user.id, data: { roles: selectedRoles } },
            { onSuccess: onClose }
        );
    };

    const isLoading = assignRoles.isPending;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
                <div className='mb-4 flex items-center justify-between'>
                    <div>
                        <h3 className='text-lg font-semibold'>Gán vai trò</h3>
                        <p className='mt-0.5 text-sm text-gray-500'>
                            Người dùng:{' '}
                            <span className='font-medium text-gray-800'>
                                {user.username}
                            </span>
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isLoading}
                        className='rounded-md p-1 text-gray-500 hover:bg-gray-100'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                <div className='mt-2'>
                    {rolesLoading ? (
                        <div className='flex items-center justify-center py-8'>
                            <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
                        </div>
                    ) : allRoles.length === 0 ? (
                        <p className='py-6 text-center text-sm text-gray-400'>
                            Chưa có vai trò nào.
                        </p>
                    ) : (
                        <div className='divide-y overflow-hidden rounded-md border border-gray-200'>
                            {allRoles.map((role) => {
                                const checked = selectedRoles.includes(role.name);
                                const isTargetAdmin = user.roles?.includes('ADMIN');
                                const isRoleAdmin = role.name === 'ADMIN';
                                const isDisabled = isTargetAdmin && isRoleAdmin;

                                return (
                                    <label
                                        key={role.name}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50',
                                            checked && 'bg-blue-50',
                                            isDisabled && 'opacity-60 cursor-not-allowed'
                                        )}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={checked}
                                            disabled={isDisabled}
                                            onChange={() =>
                                                toggleRole(role.name)
                                            }
                                            tabIndex={-1}
                                            className={cn(
                                                'h-4 w-4 rounded border-gray-300 text-blue-600',
                                                isDisabled && 'cursor-not-allowed'
                                            )}
                                        />
                                        <div>
                                            <p className='font-semibold text-gray-900'>
                                                {role.name}
                                            </p>
                                            {role.description && (
                                                <p className='text-xs text-gray-500'>
                                                    {role.description}
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className='mt-6 flex justify-end gap-3'>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isLoading}
                        className='rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        Hủy
                    </button>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className='flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isLoading && (
                            <Loader2 className='h-4 w-4 animate-spin' />
                        )}
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}

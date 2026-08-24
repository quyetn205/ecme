import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const inputId = id || 'password';

        return (
            <div className='w-full'>
                {label && (
                    <label
                        htmlFor={inputId}
                        className='mb-1 block text-sm font-medium text-gray-700'
                    >
                        {label}
                    </label>
                )}
                <div className='relative'>
                    <input
                        ref={ref}
                        id={inputId}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
                            error && 'border-red-500',
                            className
                        )}
                        {...props}
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
                        aria-label={
                            showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                        }
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className='h-5 w-5' />
                        ) : (
                            <Eye className='h-5 w-5' />
                        )}
                    </button>
                </div>
                {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

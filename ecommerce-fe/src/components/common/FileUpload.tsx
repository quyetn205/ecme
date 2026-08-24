import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadProps {
    accept?: string;
    onChange: (file: File) => void;
    preview?: string;
    label?: string;
}

export default function FileUpload({
    accept = 'image/*',
    onChange,
    preview,
    label = 'Chọn ảnh'
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div className='space-y-2'>
            <input
                ref={inputRef}
                type='file'
                accept={accept}
                onChange={handleChange}
                className='hidden'
            />
            <button
                type='button'
                onClick={handleClick}
                className='flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary'
            >
                <Upload className='h-4 w-4' />
                {label}
            </button>
            {preview && (
                <div className='relative h-32 w-32 overflow-hidden rounded-md border'>
                    <img
                        src={preview}
                        alt='Preview'
                        className='h-full w-full object-cover'
                    />
                </div>
            )}
        </div>
    );
}

export default function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className='flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xs animate-pulse'
                >
                    {/* Image placeholder */}
                    <div className='aspect-[4/3] w-full rounded-xl bg-gray-100' />

                    {/* Content */}
                    <div className='flex flex-1 flex-col pt-4 pb-2 space-y-3'>
                        {/* Category tag */}
                        <div className='h-4 w-20 rounded-md bg-gray-100' />

                        {/* Title */}
                        <div className='space-y-1.5'>
                            <div className='h-4 w-full rounded-md bg-gray-100' />
                            <div className='h-4 w-2/3 rounded-md bg-gray-100' />
                        </div>

                        {/* Price & Button */}
                        <div className='mt-auto flex items-end justify-between pt-3'>
                            <div className='h-6 w-24 rounded-md bg-gray-100' />
                            <div className='h-8 w-16 rounded-lg bg-gray-100' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

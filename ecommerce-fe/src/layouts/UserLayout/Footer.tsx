export default function Footer() {
    return (
        <footer className='border-t bg-gray-50'>
            <div className='container-page mx-auto px-4 py-8'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                            E-Commerce
                        </h3>
                        <p className='mt-2 text-sm text-gray-600'>
                            Cửa hàng điện tử trực tuyến hàng đầu Việt Nam
                        </p>
                    </div>
                    <div>
                        <h4 className='font-medium text-gray-900'>Liên hệ</h4>
                        <p className='mt-2 text-sm text-gray-600'>
                            Email: support@ecommerce.com
                        </p>
                        <p className='text-sm text-gray-600'>
                            Phone: 0123 456 789
                        </p>
                    </div>
                    <div>
                        <h4 className='font-medium text-gray-900'>Theo dõi</h4>
                        <p className='mt-2 text-sm text-gray-600'>
                            Facebook | Instagram | Zalo
                        </p>
                    </div>
                </div>
                <div className='mt-8 border-t pt-4 text-center text-sm text-gray-500'>
                    &copy; {new Date().getFullYear()} E-Commerce. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}

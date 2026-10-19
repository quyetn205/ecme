import { Outlet, Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { ROUTE_PATH } from '@/routes/route-path';

export default function AuthLayout() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-100 px-4 py-12 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md space-y-6'>
                <div className='text-center'>
                    <Link to={ROUTE_PATH.HOME} className='inline-flex flex-col items-center group'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105'>
                            <Cpu className='h-6 w-6' />
                        </div>
                        <h1 className='mt-3 text-2xl font-black tracking-tight text-gray-900'>
                            Tech<span className='text-blue-600'>Store</span>
                        </h1>
                    </Link>
                    <p className='mt-1 text-xs sm:text-sm text-gray-500'>
                        Cửa hàng điện tử & công nghệ chính hãng hàng đầu
                    </p>
                </div>

                <div className='rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-xl shadow-slate-200/60 sm:px-8'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

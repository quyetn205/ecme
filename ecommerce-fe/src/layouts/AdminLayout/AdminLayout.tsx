import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
    return (
        <div className='min-h-screen bg-gray-50'>
            <Sidebar />
            <AdminHeader />
            <main className='ml-64 mt-16 min-h-[calc(100vh-4rem)] p-6'>
                <Outlet />
            </main>
        </div>
    );
}

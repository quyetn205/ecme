import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function UserLayout() {
    return (
        <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1'>
                <div className='container-page mx-auto px-4 py-8'>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}

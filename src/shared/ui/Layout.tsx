import { Sidebar } from '@/widgets/Sidebar';
import { Outlet } from 'react-router-dom';
import { Toaster } from '../lib/toast';

export const Layout = () => {
    return (
        <main className='flex h-dvh dark:bg-primary-dark-200 relative'>
            <Toaster />
            <Sidebar />
            <Outlet />
        </main>
    );
};
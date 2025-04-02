import { LayoutSheetView } from '@/widgets/LayoutSheet/model/view';
import { LayoutSheetSkeleton } from '@/widgets/LayoutSheet/ui/Skeletons/LayoutSheetSkeleton';
import { Sidebar, SidebarProvider } from '@/widgets/Sidebar';
import React from 'react';
import ReactDOM from 'react-dom';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sheet } from './Sheet';

export const Layout = () => {
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    return (
        <main className='flex h-full dark:bg-primary-dark-200 w-full relative'>
            <Toaster />
            {isSheetOpen &&
                ReactDOM.createPortal(
                    <Sheet withHeader={false} closeHandler={() => setIsSheetOpen(false)}>
                        <React.Suspense fallback={<LayoutSheetSkeleton />}>
                            <LayoutSheetView onActionClick={() => setIsSheetOpen(false)} />
                        </React.Suspense>
                    </Sheet>,
                    document.querySelector('#modal-root')!
                )}
            <SidebarProvider>
                <Sidebar onMenuClick={() => setIsSheetOpen(true)} />
            </SidebarProvider>
            <Outlet />
        </main>
    );
};
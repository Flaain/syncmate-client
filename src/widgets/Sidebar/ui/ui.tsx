import { Loader2, X } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { Feed } from '@/widgets/Feed/ui/ui';
import { SidebarDDM } from '@/features/SidebarDDM/ui/ui';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { SidebarMenus } from '@/shared/model/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { sidebarMainSelector } from '../model/selectors';
import { useSidebar } from '../model/context';
import { useSidebarMenu } from '../lib/useSidebarMenu';

import { SettingsMenu } from './SettingsMenu';

export const Sidebar = () => {
    const { activeMenu, changeMenu, panelRef } = useSidebarMenu<SidebarMenus, HTMLDivElement>();
    const { ref, value, handleLogout, handleSearch, resetSearch } = useSidebar(useShallow(sidebarMainSelector));

    const menus: Record<SidebarMenus, React.ReactNode> = {
        settings: <SettingsMenu onBackCallback={() => panelRef.current?.classList.remove('-translate-x-10')} backToParent={changeMenu} />
    };

    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isSocketConnected = useSocket((state) => state.isConnected);
    
    const isDisconnected = !connectedToNetwork || !isSocketConnected;
    
    return (
        <aside className='grid grid-cols-1 sticky top-0 overflow-hidden gap-2 max-md:fixed dark:bg-primary-dark-150 bg-primary-white md:max-w-[420px] w-full md:border-r-2 md:border-r-primary-dark-50 md:border-solid'>
            {!!activeMenu && menus[activeMenu]}
            <div
                ref={panelRef}
                className={cn('transition-transform duration-300 ease-in-out flex flex-col col-start-1 row-start-1 bg-primary-dark-150', activeMenu && '-translate-x-10')}
            >
                <div className='flex items-center justify-between gap-5 sticky top-0 p-4 box-border h-[70px]'>
                    <SidebarDDM changeMenu={changeMenu} />
                    <div className='flex w-full relative'>
                        {isDisconnected && (
                            <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                                <Loader2 className='animate-spin size-5 z-10 text-primary-white' />
                            </div>
                        )}
                        <Input
                            ref={ref}
                            onChange={handleSearch}
                            value={value}
                            placeholder={!connectedToNetwork ? 'Waiting for network' : !isSocketConnected ? 'Connecting...' : 'Search...'}
                            className={cn(
                                'flex-1 pr-9 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50',
                                isDisconnected && 'pl-10'
                            )}
                        />
                    </div>
                    {!!value.trim().length && (
                        <Button variant='text' size='icon' onClick={resetSearch} className='p-0 absolute right-6'>
                            <X className='w-5 h-5' />
                        </Button>
                    )}
                </div>
                <Feed />
                <div className='mt-auto dark:bg-primary-dark-100 sticky bottom-0 p-4 max-h-[70px] box-border'>
                    <Button onClick={handleLogout} variant='secondary' className='w-full'>
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    );
};
import { Loader2, X } from 'lucide-react';

import { Feed } from '@/features/Feed';
import { SidebarDDM } from '@/features/SidebarDDM/ui/ui';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { SidebarMenus } from '@/shared/model/types';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { SidebarMenuContainer } from '@/shared/ui/SidebarMenu';
import { useSidebar } from '../model/useSidebar';
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SettingsMenu } from '@/features/SettingsMenu';

export const Sidebar = () => {
    const { activeMenu, changeMenu, panelRef } = useSidebarMenu<SidebarMenus, HTMLDivElement>();
    const { value, searchRef, globalResults, isSearching, handleSearch, resetSearch, handleLogout } = useSidebar();

    const menus: Record<SidebarMenus, React.ReactNode> = {
        settings: <SettingsMenu onClose={() => panelRef.current?.classList.remove('-translate-x-20')} backToParent={() => changeMenu(null)} />
    };

    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isSocketConnected = useSocket((state) => state.isConnected);
    
    const isDisconnected = !connectedToNetwork || !isSocketConnected;
    
    return (
        <aside className='grid grid-cols-1 h-dvh sticky top-0 overflow-hidden gap-2 max-md:fixed dark:bg-primary-dark-150 bg-primary-white md:max-w-[420px] w-full md:border-r-2 md:border-r-primary-dark-50 md:border-solid'>
            {!!activeMenu && menus[activeMenu]}
            <SidebarMenuContainer ref={panelRef} hasActiveMenu={!!activeMenu} className='flex flex-col z-0 animate-none !slide-in-from-right-0 transition-transform duration-300'>
                <div className='flex items-center justify-between gap-5 sticky top-0 p-4 box-border h-[70px]'>
                    <SidebarDDM changeMenu={changeMenu} />
                    <div className='flex w-full relative'>
                        {isDisconnected && (
                            <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                                <Loader2 className='animate-spin size-5 z-10 text-primary-white' />
                            </div>
                        )}
                        <Input
                            ref={searchRef}
                            onChange={handleSearch}
                            value={value}
                            placeholder={!connectedToNetwork ? 'Waiting for network' : !isSocketConnected ? 'Connecting...' : 'Search...'}
                            className={cn(
                                'flex-1 pr-9 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50',
                                isDisconnected && 'pl-10'
                            )}
                        />
                    {!!value.trim().length && (
                        <Button variant='text' size='icon' onClick={resetSearch} className='p-0 absolute right-2 top-1/2 -translate-y-1/2'>
                            <X className='w-5 h-5' />
                        </Button>
                    )}
                    </div>
                </div>
                <Feed globalResults={globalResults} searchValue={value} isSearching={isSearching} />
                <div className='mt-auto dark:bg-primary-dark-100 sticky bottom-0 p-4 max-h-[70px] box-border'>
                    <Button onClick={handleLogout} variant='secondary' className='w-full'>
                        Logout
                    </Button>
                </div>
            </SidebarMenuContainer>
        </aside>
    );
};
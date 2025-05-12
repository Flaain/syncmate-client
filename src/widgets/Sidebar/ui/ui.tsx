import { Feed } from '@/features/feed';
import { SettingsMenu } from '@/features/sidebar-menus';

import CloseIcon from '@/shared/lib/assets/icons/close.svg?react';
import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';
import SearchIcon from '@/shared/lib/assets/icons/search.svg?react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { useSidebar } from '../model/useSidebar';

import { DDM } from './DDM';

export type SidebarMenus = 'settings';

export const Sidebar = () => {
    const { activeMenu, panelRef, setActiveMenu, onClose } = useSidebarMenu<SidebarMenus, HTMLDivElement>();
    const { value, searchRef, globalResults, isSearching, handleSearch, resetSearch, handleLogout } = useSidebar();

    const menus: Record<SidebarMenus, React.ReactNode> = {
        settings: <SettingsMenu onClose={onClose} />
    };

    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isSocketConnected = useSocket((state) => state.isConnected);
    
    const isDisconnected = !connectedToNetwork || !isSocketConnected;
    
    return (
        <aside className='grid grid-cols-1 h-dvh sticky top-0 overflow-hidden gap-2 max-md:fixed dark:bg-primary-dark-150 bg-primary-white md:max-w-[420px] w-full md:border-r-2 md:border-r-primary-dark-50 md:border-solid'>
            <div ref={panelRef} className={cn('flex flex-col col-start-1 row-start-1 duration-300 overflow-hidden z-0', activeMenu && '-translate-x-20')}>
                <div className='flex items-center justify-between gap-3 sticky top-0 px-4 box-border h-[56px] mb-3'>
                    <DDM changeMenu={setActiveMenu} />
                    <div className='flex w-full relative'>
                        {isDisconnected && (
                            <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                                <LoaderIcon className='animate-loading size-6 z-10 text-primary-gray pointer-events-none' />
                            </div>
                        )}
                        {!isDisconnected && <SearchIcon className='absolute pointer-events-none top-1/2 -translate-y-1/2 text-primary-gray size-6 left-3' />}
                        <Input
                            _size='sm'
                            variant='dark'
                            outline='primary'
                            ref={searchRef}
                            onChange={handleSearch}
                            value={value}
                            placeholder={!connectedToNetwork ? 'Waiting for network' : !isSocketConnected ? 'Connecting...' : 'Search...'}
                            className='flex-1 px-12 py-0 rounded-full font-light'
                        />
                    {!!value.trim().length && (
                        <Button variant='text' size='icon' onClick={resetSearch} className='p-0 absolute right-3 top-1/2 -translate-y-1/2'>
                            <CloseIcon className='size-6 text-primary-gray' />
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
            </div>
            {!!activeMenu && menus[activeMenu]}
        </aside>
    );
};
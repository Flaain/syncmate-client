import React from 'react';

import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useShallow } from 'zustand/shallow';

import { Feed } from '@/features/feed';
import { SettingsMenu } from '@/features/sidebar-menus';

import { sidebarProfileSelector, useProfile } from '@/entities/profile';

import ArchiveIcon from '@/shared/lib/assets/icons/archive.svg?react';
import CloseIcon from '@/shared/lib/assets/icons/close.svg?react';
import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';
import LogoutIcon from '@/shared/lib/assets/icons/logout.svg?react';
import MenuIcon from '@/shared/lib/assets/icons/menu.svg?react';
import SavedMessagesIcon from '@/shared/lib/assets/icons/savedmessages.svg?react';
import SearchIcon from '@/shared/lib/assets/icons/search.svg?react';
import SettingsIcon from '@/shared/lib/assets/icons/settings.svg?react';
import StoriesIcon from '@/shared/lib/assets/icons/stories.svg?react';

import { APP_VERSION } from '@/shared/constants';
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { DropdownMenu } from '@/shared/ui/DDM';
import { Image } from '@/shared/ui/Image';
import { Input } from '@/shared/ui/input';
import { MenuItem } from '@/shared/ui/MenuItem';
import { Typography } from '@/shared/ui/Typography';

import { useSidebar } from '../model/useSidebar';

export type SidebarMenus = 'settings';

const iconStyles = 'size-5 mx-1';

export const Sidebar = () => {
    const { activeMenu, panelRef, setActiveMenu, onClose } = useSidebarMenu<SidebarMenus, HTMLDivElement>();
    const { value, searchRef, globalResults, isSearching, handleSearch, resetSearch, handleLogout } = useSidebar();
    const { name, avatar, archived_chats } = useProfile(useShallow(sidebarProfileSelector));

    const menus: Record<SidebarMenus, React.ReactNode> = {
        settings: <SettingsMenu onPrevMenu={onClose} />
    };

    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isSocketConnected = useSocket((state) => state.isConnected);

    const isDisconnected = !connectedToNetwork || !isSocketConnected;

    const sidebarMenus = React.useMemo(() => [
        {
            icon: <SavedMessagesIcon className={iconStyles} />,
            title: 'Saved Messages',
            onClick: () => setActiveMenu('settings')
        },
        {
            icon: <ArchiveIcon className={iconStyles} />,
            title: 'Archived Chats',
            description: archived_chats,
        },
        {
            icon: <StoriesIcon className={iconStyles} />,
            title: 'My Stories',
        },
        {
            icon: <SettingsIcon className={iconStyles} />,
            title: 'Settings',
            onClick: () => setActiveMenu('settings')
        },
        {
            hr: true,
            icon: <LogoutIcon className={iconStyles} />,
            title: 'Logout',
            onClick: handleLogout
        }
    ], []);

    return (
        <aside className='grid grid-cols-1 h-dvh sticky top-0 overflow-hidden gap-2 max-lg:fixed dark:bg-primary-dark bg-primary-white lg:max-w-[420px] w-full md:border-r md:border-r-primary-dark-200 md:border-solid'>
            <div
                ref={panelRef}
                className={cn(
                    'flex flex-col col-start-1 row-start-1 duration-300 overflow-hidden z-0',
                    activeMenu && '-translate-x-20'
                )}
            >
                <div className='flex items-center justify-between gap-3 sticky top-0 px-4 box-border min-h-[56px]'>
                    <DropdownMenu
                        align='start'
                        className='min-w-[200px]'
                        trigger={
                            <Button ripple variant='ghost' intent='secondary' size='icon' className='min-w-10'>
                                <MenuIcon className='text-primary-gray' />
                            </Button>
                        }
                    >
                        <MenuItem
                            type='ddm'
                            className='gap-4 relative pl-14 mt-1 mx-1'
                            onClick={() => setActiveMenu('settings')}
                            text={name}
                            displayChildrenFrom='left'
                        >
                            <Image
                                className='size-[30px] absolute rounded-full left-3 border-[1.5px] border-solid border-primary-blue object-cover'
                                src={avatar?.url}
                                skeleton={<AvatarByName name={name} className='absolute left-3 size-[30px] text-sm' />}
                            />
                        </MenuItem>
                        <hr className='opacity-20 my-[5px] block' />
                        {sidebarMenus.map(({ icon, title, description, hr, onClick }) => (
                            <MenuItem
                                key={title}
                                hr={hr}
                                className='gap-4 mx-1'
                                type='ddm'
                                description={description}
                                icon={icon}
                                onClick={onClick}
                                text={title}
                            />
                        ))}
                        <DropdownMenuSeparator className='dark:bg-primary-dark-150 w-full' asChild />
                        <Typography as='p' variant='secondary' size='xs' className='flex flex-col text-center py-1'>
                            Syncmate, Version {APP_VERSION}
                        </Typography>
                    </DropdownMenu>
                    <div className='flex w-full relative'>
                        {isDisconnected ? (
                            <div className='absolute left-3 top-1/2 -translate-y-1/2'>
                                <LoaderIcon className='animate-loading size-6 z-10 text-primary-gray pointer-events-none' />
                            </div>
                        ) : (
                            <SearchIcon className='absolute pointer-events-none top-1/2 -translate-y-1/2 text-primary-gray size-6 left-3' />
                        )}
                        <Input
                            _size='sm'
                            variant='dark'
                            outline='primary'
                            ref={searchRef}
                            onChange={handleSearch}
                            value={value}
                            placeholder={!connectedToNetwork ? 'Waiting for network' : !isSocketConnected ? 'Connecting...' : 'Search...'}
                            className='flex-1 px-12 py-0 rounded-full font-light ring-1 dark:ring-primary-dark-50 dark:hover:ring-primary-gray/60'
                        />
                        {!!value.trim().length && (
                            <Button
                                size='icon'
                                onClick={resetSearch}
                                className='absolute right-3 top-1/2 -translate-y-1/2'
                            >
                                <CloseIcon className='size-6 text-primary-gray' />
                            </Button>
                        )}
                    </div>
                </div>
                <Feed globalResults={globalResults} searchValue={value} isSearching={isSearching} />
            </div>
            {!!activeMenu && menus[activeMenu]}
        </aside>
    );
};
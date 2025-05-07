import { useShallow } from 'zustand/shallow';

import { sidebarDDMselector, useProfile } from '@/entities/profile';

import ArchiveIcon from '@/shared/lib/assets/icons/archive.svg?react';
import MenuIcon from '@/shared/lib/assets/icons/menu.svg?react';
import SavedMessagesIcon from '@/shared/lib/assets/icons/savedmessages.svg?react';
import SettingsIcon from '@/shared/lib/assets/icons/settings.svg?react';
import StoriesIcon from '@/shared/lib/assets/icons/stories.svg?react';

import { APP_VERSION } from '@/shared/constants';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { DDM as DropdownMenu } from '@/shared/ui/DDM';
import { DropdownMenuSeparator } from '@/shared/ui/dropdown-menu';
import { Image } from '@/shared/ui/Image';
import { MenuItem } from '@/shared/ui/MenuItem';
import { Typography } from '@/shared/ui/Typography';

import { SidebarMenus } from './ui';

const iconStyles = 'size-5 mx-1';

export const DDM = ({ changeMenu }: { changeMenu: (menu: SidebarMenus | null) => void }) => {
    const { name, avatar, archived_chats } = useProfile(useShallow(sidebarDDMselector));

    return (
        <DropdownMenu
            className='min-w-[200px]'
            collisionPadding={{ left: 12 }}
            trigger={
                <Button variant='ghost' size='icon' className='rounded-full p-2 opacity-50'>
                    <MenuIcon className='text-white' />
                </Button>
            }
        >
            <MenuItem
                type='ddm'
                className='gap-4'
                onClick={() => changeMenu('settings')}
                text={name}
                displayChildrenFrom='left'
            >
                <Image
                    className='size-6 rounded-full border-[1.5px] border-solid border-primary-blue object-cover'
                    src={avatar?.url}
                    skeleton={<AvatarByName name={name} className='size-5 text-sm' />}
                />
            </MenuItem>
            <DropdownMenuSeparator className='dark:bg-primary-dark-50' />
            <MenuItem
                className='gap-4'
                type='ddm'
                icon={<SavedMessagesIcon className={iconStyles} />}
                text='Saved Messages'
            />
            <MenuItem
                className='gap-4'
                type='ddm'
                icon={<ArchiveIcon className={iconStyles} />}
                text='Archived Chats'
                description={archived_chats}
            />
            <MenuItem className='gap-4' type='ddm' icon={<StoriesIcon className={iconStyles} />} text='My Stories' />
            <DropdownMenuSeparator className='dark:bg-primary-dark-50' />
            <MenuItem
                className='gap-4'
                type='ddm'
                icon={<SettingsIcon className={iconStyles} />}
                text='Settings'
                onClick={() => changeMenu('settings')}
            />
            <Typography as='p' variant='secondary' size='xs' className='flex flex-col text-center py-1'>
                Syncmate, Version {APP_VERSION}
            </Typography>
        </DropdownMenu>
    );
};
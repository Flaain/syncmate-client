import { AlignJustifyIcon, Archive, BookmarkIcon, Settings, Video } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { useProfile } from '@/entities/profile';
import { SidebarMenus } from '@/shared/model/types';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { DDM } from '@/shared/ui/DDM';
import { Image } from '@/shared/ui/Image';
import { MenuItem } from '@/shared/ui/MenuItem';
import { Button } from '@/shared/ui/button';
import { DropdownMenuSeparator } from '@/shared/ui/dropdown-menu';

const iconStyles = 'size-4 mx-1';

export const SidebarDDM = ({ changeMenu }: { changeMenu: (menu: SidebarMenus | null) => void }) => {
    const { name, avatar } = useProfile(useShallow((state) => ({ name: state.profile.name, avatar: state.profile.avatar })));

    return (
        <DDM
            className='w-[180px]'
            collisionPadding={{ left: 12 }}
            trigger={
                <Button variant='ghost' size='icon' className='rounded-full p-2 opacity-50'>
                    <AlignJustifyIcon />
                </Button>
            }
        >
            <MenuItem
                type='ddm'
                className='gap-4'
                onClick={() => changeMenu('settings')}
                icon={
                    <Image
                        className='size-6 rounded-full border-[1.5px] border-solid border-primary-blue object-cover'
                        src={avatar?.url}
                        skeleton={<AvatarByName name={name} className='size-5 text-sm' />}
                    />
                }
                text={name}
            />
            <DropdownMenuSeparator className='dark:bg-primary-dark-50' />
            <MenuItem
                className='gap-4'
                type='ddm'
                icon={<BookmarkIcon className={iconStyles} />}
                text='Saved Messages'
            />
            <MenuItem className='gap-4' type='ddm' icon={<Archive className={iconStyles} />} text='Archived Chats' />
            <MenuItem className='gap-4' type='ddm' icon={<Video className={iconStyles} />} text='My Stories' />
            <DropdownMenuSeparator className='dark:bg-primary-dark-50' />
            <MenuItem
                className='gap-4'
                type='ddm'
                icon={<Settings className={iconStyles} />}
                text='Settings'
                onClick={() => changeMenu('settings')}
            />
        </DDM>
    );
};
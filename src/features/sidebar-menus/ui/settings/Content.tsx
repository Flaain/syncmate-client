import { AtSign, Mail } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { useProfile } from '@/entities/profile';

import CameraAddIcon from '@/shared/lib/assets/icons/cameraadd.svg?react';
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react';

import { toast } from '@/shared/lib/toast';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { SettingMenus } from '../../model/types';

const iconStyles = 'size-6 text-primary-white/60';

export const SettingsContent = ({ changeMenu }: { changeMenu: (menu: SettingMenus) => void }) => {
    const { email, name, avatar, login } = useProfile(useShallow((state) => state.profile));

    const handleCopy = (type: 'Email' | 'Login', value: string) => {
        navigator.clipboard.writeText(value);
        toast.success(`${type} copied to clipboard`);
    };

    return (
        <>
            <div className='px-4 flex flex-col relative'>
                <div className='flex flex-col mb-5'>
                    <Image
                        className='size-32 rounded-full self-center border border-solid border-primary-blue'
                        src={avatar?.url}
                        skeleton={<AvatarByName name={name} className='size-32 self-center' size='5xl' />}
                    />
                    <Typography size='2xl' weight='medium' className='flex self-center pt-2 line-clamp-1'>
                        {name}
                    </Typography>
                </div>
                <SidebarMenuButton
                    title={email}
                    description='Email'
                    onClick={() => handleCopy('Email', email)}
                    icon={<Mail className={iconStyles} />}
                />
                <SidebarMenuButton
                    title={login.substring(0, 1).toUpperCase() + login.substring(1)}
                    description='Login'
                    onClick={() => handleCopy('Login', login)}
                    icon={<AtSign className={iconStyles} />}
                />
                <Button
                    variant='text'
                    size='icon'
                    className='absolute right-4 top-1/2 rounded-full size-14 bg-primary-blue'
                >
                    <CameraAddIcon className='size-6' />
                </Button>
            </div>
            <SidebarMenuSeparator />
            <ul className='px-4 flex flex-col'>
                <li className='flex'>
                    <SidebarMenuButton
                        className='py-4 flex-1'
                        title='Privacy and Security'
                        onClick={() => changeMenu('privacy')}
                        icon={<LockIcon className={iconStyles} />}
                    />
                </li>
            </ul>
        </>
    );
};

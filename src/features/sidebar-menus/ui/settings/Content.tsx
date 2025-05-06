import { useShallow } from 'zustand/shallow';

import { settingsSidebarMenuSelector, useProfile } from '@/entities/profile';

import CameraAddIcon from '@/shared/lib/assets/icons/cameraadd.svg?react';
import DataIcon from '@/shared/lib/assets/icons/data.svg?react';
import EmailIcon from '@/shared/lib/assets/icons/email.svg?react';
import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react';
import MentionIcon from '@/shared/lib/assets/icons/mention.svg?react';

import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils/cn';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { SettingMenus } from '../../model/types';

const iconStyles = 'size-6 text-primary-white/60';

export const SettingsContent = ({ changeMenu }: { changeMenu: (menu: SettingMenus) => void }) => {
    const { email, name, avatar, login, isUploadingAvatar, handleUploadAvatar } = useProfile(
        useShallow(settingsSidebarMenuSelector)
    );

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
                    icon={<EmailIcon className={iconStyles} />}
                />
                <SidebarMenuButton
                    title={login.substring(0, 1).toUpperCase() + login.substring(1)}
                    description='Login'
                    onClick={() => handleCopy('Login', login)}
                    icon={<MentionIcon className={iconStyles} />}
                />
                <Label
                    aria-disabled={isUploadingAvatar}
                    className={cn(
                        'absolute right-4 top-1/2 group p-4 rounded-full bg-primary-purple hover:bg-primary-purple/70 transition-colors duration-200 ease-in-out',
                        isUploadingAvatar ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    )}
                >
                    <Input
                        type='file'
                        className='z-50 sr-only'
                        onChange={handleUploadAvatar}
                        disabled={isUploadingAvatar}
                    />
                    {isUploadingAvatar ? (
                        <LoaderIcon className='size-6 text-primary-white animate-loading duration-700' />
                    ) : (
                        <CameraAddIcon className='size-6 transition-all text-primary-white' />
                    )}
                </Label>
            </div>
            <SidebarMenuSeparator />
            <ul className='px-4 flex flex-col'>
                <li>
                    <SidebarMenuButton
                        title='Data ans Storage'
                        onClick={() => changeMenu('data')}
                        icon={<DataIcon className={iconStyles} />}
                    />
                </li>
                <li>
                    <SidebarMenuButton
                        title='Privacy and Security'
                        onClick={() => changeMenu('privacy')}
                        icon={<LockIcon className={iconStyles} />}
                    />
                </li>
            </ul>
        </>
    );
};
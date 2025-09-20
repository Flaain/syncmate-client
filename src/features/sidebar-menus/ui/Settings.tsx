import React from 'react';

import { useShallow } from 'zustand/shallow';

import { settingsSidebarMenuSelector, useProfile } from '@/entities/profile';

import CameraAddIcon from '@/shared/lib/assets/icons/cameraadd.svg?react';
import DataIcon from '@/shared/lib/assets/icons/data.svg?react';
import SessionsIcon from '@/shared/lib/assets/icons/devices.svg?react';
import EmailIcon from '@/shared/lib/assets/icons/email.svg?react';
import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react';
import MentionIcon from '@/shared/lib/assets/icons/mention.svg?react';
import VerifiedIcon from '@/shared/lib/assets/icons/verified.svg?react';

import { useStackable } from '@/shared/lib/providers/stackable';
import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { Image } from '@/shared/ui/Image';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { SettingsSubmenu } from '../model/types';
import { DataStorage, Privacy, Sessions } from '../model/view';

import { DataStorageSkeleton } from './Skeletons/DataStorageSkeleton';
import { PrivacySkeleton } from './Skeletons/PrivacySkeleton';
import { SessionsSkeleton } from './Skeletons/SessionsSkeleton';
import { SuspenseError } from './SuspenseError';

const iconStyles = 'size-6 text-primary-white/60';

const settingsSubmenus: Record<SettingsSubmenu, { title: string; content: React.ReactNode; fallback?: React.ReactNode }> = {
    data: {
        title: 'Data and Storage',
        content: <DataStorage />,
        fallback: <DataStorageSkeleton />,
    },
    privacy: {
        title: 'Privacy and Security',
        content: <Privacy />,
        fallback: <PrivacySkeleton />,
    },
    sessions: {
        title: 'Devices',
        content: <Sessions />,
        fallback: <SessionsSkeleton />,
    },
}

export const Settings = () => {
    const { email, name, avatar, login, isUploadingAvatar, isOfficial, counts, handleUploadAvatar } = useProfile(useShallow(settingsSidebarMenuSelector));
    const { open } = useStackable();

    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isSocketConnected = useSocket((state) => state.isConnected);

    const handleCopy = (type: 'Email' | 'Login', value: string) => {
        navigator.clipboard.writeText(value);
        toast.success(`${type} copied to clipboard`);
    };

    const handleOpenMenu = (menu: SettingsSubmenu) => {
        const { title, content, fallback } = settingsSubmenus[menu];

        open({
            id: `settings-${menu}`,
            title,
            content: (
                <ErrorBoundary fallback={<SuspenseError name={title.toLowerCase()} skeleton={fallback} />}>
                    <React.Suspense fallback={fallback}>
                        {content}
                    </React.Suspense>
                </ErrorBoundary>
            )
        });
    }

    return (
        <>
            <div className='px-2 flex flex-col relative'>
                <div className='flex flex-col items-center mb-5'>
                    <Image
                        className='size-32 rounded-full self-center border border-solid border-primary-blue'
                        src={avatar?.url}
                        skeleton={<AvatarByName name={name} className='size-32 self-center' size='5xl' />}
                    />
                    <div className='flex items-center flex-col mt-2'>
                        <div className='flex items-start gap-2'>
                            <Typography size='2xl' weight='medium' className='flex self-center line-clamp-1'>
                                {name}
                            </Typography>
                            {isOfficial && <VerifiedIcon className='text-primary-blue size-5' />}
                        </div>
                        <Typography as='p' size='sm' variant='secondary'>
                            {!connectedToNetwork || !isSocketConnected ? 'offline' : 'online'}
                        </Typography>
                    </div>
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
            <div className='px-2 flex flex-col'>
                <SidebarMenuButton
                    title='Data ans Storage'
                    onClick={() => handleOpenMenu('data')}
                    icon={<DataIcon className={iconStyles} />}
                />
                <SidebarMenuButton
                    title='Privacy and Security'
                    onClick={() => handleOpenMenu('privacy')}
                    icon={<LockIcon className={iconStyles} />}
                />
                <SidebarMenuButton
                    title='Devices'
                    count={counts.active_sessions}
                    onClick={() => handleOpenMenu('sessions')}
                    icon={<SessionsIcon className={iconStyles} />}
                />
            </div>
        </>
    );
};
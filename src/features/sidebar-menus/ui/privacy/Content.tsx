import { useProfile } from '@/entities/profile';

import DeleteUserIcon from '@/shared/lib/assets/icons/deleteuser.svg?react';
import SessionsIcon from '@/shared/lib/assets/icons/devices.svg?react';
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react';

import { AnimatedSkeleton } from '@/shared/ui/AnimatedSkeleton';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

import { PrivacyAndSecurity, PrivacyAndSecurityMenuContentProps, PrivacyAndSecurityMenus } from '../../model/types';
import { getPrivacyAndSecurityMenuButtonDescription } from '../../utils/getPrivacyAndSecurityMenuButtonDescription';

export const iconStyles = 'text-primary-gray';

export const PrivacyAndSecurityMenuContent = ({ changeMenu, data, isError, isLoading, activeSettingMenuRef }: PrivacyAndSecurityMenuContentProps<PrivacyAndSecurityMenus>) => {
    const active_sessions = useProfile((state) => state.profile.counts.active_sessions);

    const handleSettingClick = (setting: keyof PrivacyAndSecurity) => {
        changeMenu('setting');
        activeSettingMenuRef.current = setting;
    }

    return (
        <div className='flex flex-col'>
            <div className='px-2 flex flex-col'>
                <SidebarMenuButton
                    icon={<DeleteUserIcon className={iconStyles} />}
                    title='Blocked Users'
                    description='12 users'
                />
                <SidebarMenuButton
                    icon={<LockIcon className={iconStyles} />}
                    title='Two-Step Verification'
                    description='off'
                />
                <SidebarMenuButton
                    onClick={() => changeMenu('sessions')}
                    icon={<SessionsIcon className={iconStyles} />}
                    title='Active Sessions'
                    description={`${active_sessions} ${active_sessions > 1 ? 'devices' : 'device'}`}
                />
            </div>
            <SidebarMenuSeparator className='h-auto'>
                Manage your privacy settings accross all devices
            </SidebarMenuSeparator>
            {isLoading || isError ? ( // TODO: create error comp with retry
                <div className='px-2 flex flex-col relative'>
                    <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50 mb-4' />
                    <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/50 mb-4 before:!border-primary-gray/10' />
                    <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/30 mb-4 before:!border-primary-gray/10' />
                    <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/20 mb-4 before:!border-primary-gray/10' />
                    <AnimatedSkeleton className='py-2 px-2 h-14 rounded-lg bg-primary-dark-50/10 before:border-none' />
                </div>
            ) : ( // THINK: maybe rewrite to arr?
                <div className='px-2 flex flex-col'>
                    <SidebarMenuButton
                        title='Who can see my email adress?'
                        onClick={() => handleSettingClick('whoCanSeeMyEmail')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanSeeMyEmail)}
                    />
                    <SidebarMenuButton
                        title='Who can see my Last Seen time?'
                        onClick={() => handleSettingClick('whoCanSeeMyLastSeenTime')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanSeeMyLastSeenTime)}
                    />
                    <SidebarMenuButton
                        title='Who can see my profile photos?'
                        onClick={() => handleSettingClick('whoCanSeeMyProfilePhotos')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanSeeMyProfilePhotos)}
                    />
                    <SidebarMenuButton
                        title='Who can see my bio?'
                        onClick={() => handleSettingClick('whoCanSeeMyBio')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanSeeMyBio)}
                    />
                    <SidebarMenuButton
                        className='whitespace-normal text-left h-min'
                        title='Who can add link to my account when forwarding my messages?'
                        onClick={() => handleSettingClick('whoCanLinkMyProfileViaForward')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanLinkMyProfileViaForward)}
                    />
                    <SidebarMenuButton
                        title='Who can add me to group chats?'
                        onClick={() => handleSettingClick('whoCanAddMeToGroupChats')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanAddMeToGroupChats)}
                    />
                    <SidebarMenuButton
                        title='Who can send me messages?'
                        onClick={() => handleSettingClick('whoCanSendMeMessages')}
                        description={getPrivacyAndSecurityMenuButtonDescription(data.whoCanSendMeMessages)}
                    />
                </div>
            )}
        </div>
    );
};
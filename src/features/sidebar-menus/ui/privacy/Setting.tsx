import React from 'react';

import { profileApi } from '@/entities/profile';

import AddUserIcon from '@/shared/lib/assets/icons/adduser.svg?react';
import DeleteUserIcon from '@/shared/lib/assets/icons/deleteuser.svg?react';

import { ApiBaseSuccessData } from '@/shared/api';
import { useQuery } from '@/shared/lib/hooks/useQuery';
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { Radio } from '@/shared/ui/Radio';
import { SidebarMenuButton, SidebarMenuContainer, SidebarMenuHeader, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { PrivacyAndSecuitySettingProps, PrivacyAndSecurity, PrivacyMode } from '../../model/types';
import { getPrivacyAndSecurityExceptionButtonDescription } from '../../utils/getPrivacyAndSecurityExceptionButtonDescription';
import { isCorrectMode } from '../../utils/isCorrectMode';

import { iconStyles } from './Content';

const settingsMap: Record<keyof PrivacyAndSecurity, { title: string; description?: string; setting: string; isViewPermission?: boolean }> = {
    whoCanSeeMyEmail: {
        title: 'Email Address',
        setting: 'Who can see my email address?',
        isViewPermission: true
    },
    whoCanSeeMyLastSeenTime: {
        title: 'Last Seen & Online',
        setting: 'Who can see my Last Seen time?',
        description: 'You won\'t see Last Seen or Online statuses for people with whom you don\'t share yours. Approximate times will be shown instead (recently, within a week, within a month).',
        isViewPermission: true
    },
    whoCanSeeMyProfilePhotos: {
        title: 'Profile Photos',
        setting: 'Who can see my profile photos?',
        description: 'You can restrict who can see your profile photo with granular precision.',
        isViewPermission: true
    },
    whoCanSeeMyBio: {
        title: 'Bio',
        setting: 'Who can see my bio?',
        description: 'You can restrict who can see the bio on your profile with granular precision.',
        isViewPermission: true
    },
    whoCanLinkMyProfileViaForward: {
        title: 'Forwarded Messages',
        setting: 'Who can add a link to my account when forwarding my messages?',
        description: 'You can restrict who can add a link to your account when forwarding your messages.'
    },
    whoCanAddMeToGroupChats: {
        title: 'Group chats',
        setting: 'Who can add me to group chats?',
        description: 'You can restrict who can add you to groups and channels with granular precision.'
    },
    whoCanSendMeMessages: {
        title: 'Messages',
        setting: 'Who can send me messages?',
        description: 'You can restrict messages from users who are not in your contacts.'
    }
}

// THINK: maybe it's overhead but i decided just create reusable setting component instead of doing 7 components (for each privacy setting)
// however, I believe that for better scalability, it would be better to use a separate component for each setting.

export const PrivacyAndSecuitySetting = ({ data, setData, onPrevMenu, activeSettingMenuRef }: PrivacyAndSecuitySettingProps) => {
    const { title, description, setting } = settingsMap[activeSettingMenuRef.current!];
    const { panelRef, shouldRemove, onAnimationEnd, activeMenu, setActiveMenu, onClose, handleBack } = useSidebarMenu<null, HTMLDivElement>(onPrevMenu);
    const { call } = useQuery<ApiBaseSuccessData, { setting: keyof PrivacyAndSecurity, mode: PrivacyMode }>(({ signal, args }) => profileApi.updatePrivacySettingMode(args!, signal), { enabled: false });

    const settingData = data[activeSettingMenuRef.current!];
    const isEverybody = settingData.mode === 1;

    const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const mode = +value;

        if (!isCorrectMode(mode)) return;
        
        setData((prevState) => ({
            ...prevState,
            [activeSettingMenuRef.current!]: { ...prevState[activeSettingMenuRef.current!], mode }
        }));

        call({ setting: activeSettingMenuRef.current!, mode });
    }

    return (
        <>
            <SidebarMenuContainer
                ref={panelRef}
                hasActiveMenu={!!activeMenu}
                shouldRemove={shouldRemove}
                onBack={handleBack}
                onAnimationEnd={onAnimationEnd}
            >
                <SidebarMenuHeader title={title} onBack={handleBack} />
                <React.Suspense fallback={<div>loading...</div>}>
                    <div className='px-2 pt-4'>
                        <Typography className='flex px-4 pb-2' weight='medium' size='md'>{setting}</Typography>
                        <Radio name="mode" ripple onChange={onChange} value={1} label='Everybody' checked={isEverybody} />
                        <Radio name="mode" ripple onChange={onChange} value={0} label='Nobody'checked={!isEverybody} />
                    </div>
                    <SidebarMenuSeparator className='h-auto'>{description}</SidebarMenuSeparator>
                    <div className='px-2 pt-4'>
                        <Typography className='flex px-4 pb-2' weight='medium' size='md'>Exceptions</Typography>
                        <SidebarMenuButton
                            // onClick={() => changeMenu('sessions')}
                            icon={isEverybody ? <DeleteUserIcon className={iconStyles} /> : <AddUserIcon className={iconStyles} />}
                            title={`${isEverybody ? 'Never' : 'Always'} ${settingsMap[activeSettingMenuRef.current!].isViewPermission ? 'share with' : 'allow'}`}
                            description={getPrivacyAndSecurityExceptionButtonDescription(settingData)}
                        />
                    </div>
                    <SidebarMenuSeparator className='h-auto'>
                        You can add users as exception that will ovveride the settings above.
                    </SidebarMenuSeparator>
                </React.Suspense>
            </SidebarMenuContainer>
        </>
    );
};
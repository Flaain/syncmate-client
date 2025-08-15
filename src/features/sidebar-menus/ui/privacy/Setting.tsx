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

import { settingsMap } from '../../model/constants';
import { PrivacyAndSecuitySettingProps, PrivacyAndSecurity, PrivacyMode } from '../../model/types';
import { getPrivacyAndSecurityExceptionButtonDescription } from '../../utils/getPrivacyAndSecurityExceptionButtonDescription';
import { isCorrectMode } from '../../utils/isCorrectMode';

import { iconStyles } from './Content';

export const PrivacyAndSecuitySetting = ({ data, setData, onPrevMenu, activeSettingMenuRef }: PrivacyAndSecuitySettingProps) => {
    const { title, description, setting } = settingsMap[activeSettingMenuRef.current!];
    const { panelRef, shouldRemove, onAnimationEnd, activeMenu, handleBack } = useSidebarMenu<null, HTMLDivElement>(onPrevMenu);
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
                        You can add users as exception that will overide the settings above.
                    </SidebarMenuSeparator>
                </React.Suspense>
            </SidebarMenuContainer>
        </>
    );
};
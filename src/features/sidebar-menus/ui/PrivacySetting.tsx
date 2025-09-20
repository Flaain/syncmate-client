import React from 'react';

import { profileApi } from '@/entities/profile';

import AddUserIcon from '@/shared/lib/assets/icons/adduser.svg?react';
import DeleteUserIcon from '@/shared/lib/assets/icons/deleteuser.svg?react';

import { Radio } from '@/shared/ui/Radio';
import { SidebarMenuButton, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { settingsMap } from '../model/constants';
import { PRIVACY_MODE, PrivacyAndSecuitySettingProps } from '../model/types';
import { getPrivacyAndSecurityExceptionButtonDescription } from '../utils/getPrivacyAndSecurityExceptionButtonDescription';
import { isCorrectMode } from '../utils/isCorrectMode';

import { iconStyles } from './Privacy';

export const PrivacySetting = ({ onModeChange, initialSettingData, activeSetting }: PrivacyAndSecuitySettingProps) => {
    const { 0: setting, 1: setSetting } = React.useState(initialSettingData);

    const { description, label, isViewPermission } = settingsMap[activeSetting];

    const isEverybody = PRIVACY_MODE[setting.mode] === 'everybody';
    
    const lastSubmittedMode = React.useRef(initialSettingData.mode);
    const changeModeAbortController = React.useRef<AbortController>(null);

    const onChange = async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        changeModeAbortController.current?.abort();
        changeModeAbortController.current = new AbortController();

        const mode = +value;

        if (!isCorrectMode(mode) || mode === lastSubmittedMode.current) return;

        onModeChange(mode);
        setSetting({ ...setting, mode });

        try {
            await profileApi.updatePrivacySettingMode({ mode, setting: activeSetting }, changeModeAbortController.current.signal);

            lastSubmittedMode.current = mode;
        } catch (error) {
            onModeChange(lastSubmittedMode.current);
            setSetting({ ...setting, mode: lastSubmittedMode.current });
        }
    };

    return (
        <>
            <div className='px-2 pt-4'>
                <Typography className='flex px-4 pb-2' weight='medium' size='md'>
                    {label}
                </Typography>
                <Radio name='mode' ripple onChange={onChange} value={1} label='Everybody' checked={isEverybody} />
                <Radio name='mode' ripple onChange={onChange} value={0} label='Nobody' checked={!isEverybody} />
            </div>
            <SidebarMenuSeparator className='h-auto'>{description}</SidebarMenuSeparator>
            <div className='px-2 pt-4'>
                <Typography className='flex px-4 pb-2' weight='medium' size='md'>
                    Exceptions
                </Typography>
                <SidebarMenuButton
                    // onClick={() => changeMenu('sessions')}
                    icon={isEverybody ? <DeleteUserIcon className={iconStyles} /> : <AddUserIcon className={iconStyles} />}
                    title={`${isEverybody ? 'Never' : 'Always'} ${isViewPermission ? 'share with' : 'allow'}`}
                    description={getPrivacyAndSecurityExceptionButtonDescription(setting)}
                    />
            </div>
            <SidebarMenuSeparator className='h-auto'>
                You can add users as exception that will overide the settings above.
            </SidebarMenuSeparator>
                    </>
    );
};
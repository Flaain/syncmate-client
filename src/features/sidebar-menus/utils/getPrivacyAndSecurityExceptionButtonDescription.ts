import { PrivacyAndSecurityFieldWithChoose } from '../model/types';

export const getPrivacyAndSecurityExceptionButtonDescription = (setting: PrivacyAndSecurityFieldWithChoose) => {
    const value = setting.mode === 1 ? setting.deny : setting.allow;

    return value ? `${value} ${value > 1 ? 'users' : 'user'}` : 'Add users';
};
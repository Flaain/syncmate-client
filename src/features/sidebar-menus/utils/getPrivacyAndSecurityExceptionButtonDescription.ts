import { PrivacyAndSecurityFieldWithChoose } from '../model/types';

export const getPrivacyAndSecurityExceptionButtonDescription = (setting: PrivacyAndSecurityFieldWithChoose) => {
    const isEverybody = setting.mode === 1;

    return isEverybody
        ? setting.deny
            ? `${setting.deny} ${setting.deny > 1 ? 'users' : 'user'}`
            : 'Add users'
        : setting.allow
          ? `${setting.allow} ${setting.allow > 1 ? 'users' : 'user'}`
          : 'Add users';
};
import { capitalizeFirstLetter } from '@/shared/lib/utils/capitalizeFirstLetter';

import { PrivacyAndSecurityFieldWithChoose, PRIVACY_MODE } from '../model/types';

export const getPrivacyAndSecurityMenuButtonDescription = (setting: PrivacyAndSecurityFieldWithChoose) => {
    const mode = capitalizeFirstLetter(PRIVACY_MODE[setting.mode]);

    return `${mode} ${setting.mode === 1 ? (setting.deny ? `(-${setting.deny})` : '') : setting.allow ? `(+${setting.allow})` : ''}`;
};
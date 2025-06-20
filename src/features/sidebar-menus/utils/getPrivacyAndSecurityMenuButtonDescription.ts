import { capitalizeFirstLetter } from '@/shared/lib/utils/capitalizeFirstLetter';

import { PrivacyAndSecurityFieldWithChoose, PrivacyModeMap } from '../model/types';

export const getPrivacyAndSecurityMenuButtonDescription = (setting: PrivacyAndSecurityFieldWithChoose) => {
    const mode = capitalizeFirstLetter(PrivacyModeMap[setting.mode]);

    return `${mode} ${setting.mode === 1 ? (setting.deny ? `(-${setting.deny})` : '') : setting.allow ? `(+${setting.allow})` : ''}`;
};
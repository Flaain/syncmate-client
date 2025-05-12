import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { PRESENCE } from '@/shared/model/types';

import { GetDescriptionParams } from '../model/types';

export const getDescription = ({ lastSeenAt, presence, isInitiatorBlocked, isRecipientBlocked, isRecipientTyping }: GetDescriptionParams) => {
    const isRecipientOnline = presence === PRESENCE.online;

    if (isInitiatorBlocked || isRecipientBlocked) return 'last seen recently';
    if (isRecipientTyping && isRecipientOnline) return `typing...`;

    return isRecipientOnline ? 'online' : `last seen ${getRelativeTimeString(lastSeenAt, 'en-US')}`;
};
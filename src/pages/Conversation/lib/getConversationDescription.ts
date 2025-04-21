import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { PRESENCE } from '@/shared/model/types';

import { GetDescriptionParams } from '../model/types';

export const getConversationDescription = ({ data, shouldDisplayTypingStatus = true, isRecipientTyping }: GetDescriptionParams) => {
    const isRecipientOnline = data.recipient.presence === PRESENCE.ONLINE;

    if (data.isInitiatorBlocked || data.isRecipientBlocked) return 'last seen recently';
    if (isRecipientTyping && isRecipientOnline && shouldDisplayTypingStatus) return `typing...`;

    return isRecipientOnline ? 'online' : `last seen ${getRelativeTimeString(data.recipient.lastSeenAt, 'en-US')}`;
};
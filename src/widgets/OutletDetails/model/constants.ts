import { FeedTypes } from '@/shared/model/types';

export const titles: Record<Exclude<FeedTypes, 'User' | 'ADS'>, string> = {
    Conversation: 'User Info',
    Group: 'Group Info'
};
import { AdsFeed, ConversationFeed, FeedTypes, GroupFeed } from '@/shared/model/types';

export type SortParam = ConversationFeed | GroupFeed | AdsFeed;

export const getSortedFeedByLastMessage = (a: SortParam, b: SortParam) => {
    return a.type === FeedTypes.ADS || b.type === FeedTypes.ADS ? 0 : new Date(b.lastActionAt).getTime() - new Date(a.lastActionAt).getTime();
};
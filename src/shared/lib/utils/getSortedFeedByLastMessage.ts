import { FeedTypes } from '@/widgets/Feed/types';
import { LocalFeed } from '@/widgets/Sidebar/model/types';

export const getSortedFeedByLastMessage = (a: LocalFeed, b: LocalFeed) => {
    return a.type === FeedTypes.ADS || b.type === FeedTypes.ADS ? 0 : new Date(b.lastActionAt).getTime() - new Date(a.lastActionAt).getTime();
};
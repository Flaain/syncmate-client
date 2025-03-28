import { ConversationItem, UserItem } from '@/widgets/Feed';
import { AdsFeed, FeedTypes, UserFeed } from '@/widgets/Feed/model/types';
import { AdsItem } from '@/widgets/Feed/ui/AdsItem';
import { ExctactLocalFeedItem, LocalResults } from './types';

export const localFilters: Record<FeedTypes.CONVERSATION, (item: any, value: string) => boolean> = {
    Conversation: ({ item: { recipient: { name, login } } }: ExctactLocalFeedItem<FeedTypes.CONVERSATION>, value) => {
        return name.toLowerCase().includes(value) || login.toLowerCase().includes(value);
    }
};

export const globalFilters: Record<FeedTypes.USER, (item: any, localResults: LocalResults['feed']) => boolean> = {
    User: ({ _id }: UserFeed, localResults) => localResults.some(({ type, item }) => type === FeedTypes.CONVERSATION && item.recipient._id === _id)
};

export const localFeedItems: Record<Exclude<FeedTypes, 'Cloud' | 'Channel' | 'User'>, (feedItem: any) => React.ReactNode> = {
    Conversation: (feedItem: ExctactLocalFeedItem<FeedTypes.CONVERSATION>) => <ConversationItem key={feedItem._id} feedItem={feedItem} />,
    ADS: (item: AdsFeed) => <AdsItem adsItem={item} key={item._id} />
}

export const globalFeedItems: Record<Exclude<FeedTypes, 'ADS' | 'Cloud' | 'Channel' | 'Conversation'>, (feedItem: any) => React.ReactNode> = {
    User: (item: UserFeed) => <UserItem user={item} key={item._id} />,
};
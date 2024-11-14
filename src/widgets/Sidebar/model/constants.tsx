import { ConversationItem, GroupItem, UserItem } from '@/widgets/Feed';
import { AdsItem } from '@/widgets/Feed/ui/AdsItem';
import { ExctactLocalFeedItem, LocalResults } from './types';
import { AdsFeed, FeedTypes, GroupFeed, UserFeed } from '@/widgets/Feed/types';

export const localFilters: Record<FeedTypes.CONVERSATION | FeedTypes.GROUP, (item: any, value: string) => boolean> = {
    Conversation: ({ item: { recipient: { name, login } } }: ExctactLocalFeedItem<FeedTypes.CONVERSATION>, value) => {
        return name.toLowerCase().includes(value) || login.toLowerCase().includes(value);
    },
    Group: ({ item: { name, login } }: ExctactLocalFeedItem<FeedTypes.GROUP>, value) => {
        return name.toLowerCase().includes(value) || login.toLowerCase().includes(value);
    }
};

export const globalFilters: Record<FeedTypes.GROUP | FeedTypes.USER, (item: any, localResults: LocalResults['feed']) => boolean> = {
    User: ({ _id }: UserFeed, localResults) => localResults.some(({ type, item }) => type === FeedTypes.CONVERSATION && item.recipient._id === _id),
    Group: ({ _id }: ExctactLocalFeedItem<FeedTypes.GROUP>, localResults) => localResults.some(({ type, item }) => type === FeedTypes.GROUP && item._id === _id)
};

export const feedItems: Record<Exclude<FeedTypes, 'Cloud' | 'Channel'>, (feedItem: any) => React.ReactNode> = {
    Conversation: (feedItem: ExctactLocalFeedItem<FeedTypes.CONVERSATION>) => <ConversationItem key={feedItem._id} feedItem={feedItem} />,
    User: (item: UserFeed) => <UserItem user={item} key={item._id} />,
    Group: (item: GroupFeed) => <GroupItem group={item} key={item._id} />,
    ADS: (item: AdsFeed) => <AdsItem adsItem={item} key={item._id} />
};
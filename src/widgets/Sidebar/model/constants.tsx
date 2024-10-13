import { AdsFeed, ConversationFeed, FeedItem, FeedTypes, GroupFeed, UserFeed } from '@/shared/model/types';
import { ConversationItem, GroupItem, UserItem } from '@/widgets/Feed';
import { AdsItem } from '@/widgets/Feed/ui/AdsItem';
import { LocalResults } from './types';

export const localFilters: Record<Exclude<FeedTypes, 'User' | 'ADS'>, (item: FeedItem, value: string) => boolean> = {
    Conversation: (item, value) => {
        const { name, login } = (item as ConversationFeed).recipient;

        return name.toLowerCase().includes(value) || login.toLowerCase().includes(value);
    },
    Group: (item, value) => {
        const { name, login } = (item as GroupFeed);

        return name.toLowerCase().includes(value) || login.toLowerCase().includes(value);
    }
};

export const globalFilters: Record<Exclude<FeedTypes, 'Conversation' | 'ADS'>, (item: FeedItem, localResults: LocalResults['feed']) => boolean> = {
    User: (item, localResults) => localResults.some((localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.recipient._id === item._id),
    Group: (item, localResults) => localResults.some((localItem) => localItem._id === item._id)
};

export const feedItems: Record<FeedTypes, (item: FeedItem) => React.ReactNode> = {
    Conversation: (item) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
    User: (item) => <UserItem user={item as UserFeed} key={item._id} />,
    Group: (item) => <GroupItem group={item as GroupFeed} key={item._id} />,
    ADS: (item) => <AdsItem adsItem={item as AdsFeed} key={item._id}/>
};
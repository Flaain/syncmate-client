import { AdsFeed, ConversationFeed, FeedItem, FeedTypes, GroupFeed, UserFeed } from '@/shared/model/types';
import { ConversationItem, GroupItem, UserItem } from '@/widgets/Feed';
import { AdsItem } from '@/widgets/Feed/ui/AdsItem';

export const localFilters: Record<Exclude<FeedTypes, 'User' | 'ADS'>, (item: FeedItem, value: string) => boolean> = {
    Conversation: (item, value) =>
        (item as ConversationFeed).recipient.name.toLowerCase().includes(value) ||
        (item as ConversationFeed).recipient.login.toLowerCase().includes(value),
    Group: (item, value) =>
        (item as GroupFeed).name.toLowerCase().includes(value) ||
        (item as GroupFeed).login.toLowerCase().includes(value)
};

export const globalFilters: Record<
    Exclude<FeedTypes, 'Conversation' | 'ADS'>,
    (item: FeedItem, localResults: Array<ConversationFeed | GroupFeed | AdsFeed>) => boolean
> = {
    User: (item, localResults) =>
        localResults.some(
            (localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.recipient._id === item._id
        ),
    Group: (item, localResults) => localResults.some((localItem) => localItem._id === item._id)
};

export const feedItems: Record<FeedTypes, (item: FeedItem) => React.ReactNode> = {
    Conversation: (item) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
    User: (item) => <UserItem user={item as UserFeed} key={item._id} />,
    Group: (item) => <GroupItem group={item as GroupFeed} key={item._id} />,
    ADS: (item) => <AdsItem adsItem={item as AdsFeed} key={item._id}/>
};
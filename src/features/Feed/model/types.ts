import { IMessage } from "@/entities/message";
import { SearchUser } from "@/entities/profile";

import { Recipient, WrappedInPagination } from "@/shared/model/types";
import { TypingParticipant } from "@/shared/ui/Typography";

export enum FEED_TYPE {
    CONVERSATION = 'Conversation',
    USER = 'User',
}

export enum FEED_EVENT {
    CREATE = 'feed.create',
    UPDATE = 'feed.update',
    DELETE = 'feed.delete',
    UNREAD_COUNTER = 'feed.unread.counter',
    USER_PRESENCE = 'feed.user.presence',
    START_TYPING = 'feed.start.typing',
    STOP_TYPING = 'feed.stop.typing'
}

export type ExctactFeedItem<T, U extends FEED_TYPE> = Extract<T, { type: U }>;

export type LocalFeed = LocalFeedItemWrapper<FEED_TYPE.CONVERSATION, ConversationFeed>;
export type LocalFeedType = { [K in keyof LocalFeedItemMap]: (item: LocalFeedItemMap[K]) => React.ReactNode };
export type LocalFeedCounterMapType = { [K in keyof LocalFeedItemMap]: (item: LocalFeedItemMap[K]) => LocalFeed };
export type LocalFiltersType = { [K in keyof LocalFeedItemMap]: (item: LocalFeedItemMap[K], value: string) => boolean };
export type LocalResults = { feed: Array<LocalFeed>; nextCursor: string | null };

export type GlobalFeed = UserFeed;
export type GlobalFeedType = { [K in keyof GlobalFeedItemMap]: (item: GlobalFeedItemMap[K]) => React.ReactNode };
export type GlobalFiltersType = { [K in keyof GlobalFeedItemMap]: (item: GlobalFeedItemMap[K], local: Array<LocalFeed>) => boolean };
export type GlobalResults = WrappedInPagination<GlobalFeed>;

export type UserFeed = SearchUser & { type: FEED_TYPE.USER };

export interface FeedProps {
    globalResults: GlobalResults | null;
    searchValue: string;
    isSearching?: boolean;
}

export interface LocalFeedItemWrapper<T extends FEED_TYPE, I> {
    _id: string;
    lastActionAt: string;
    createdAt: string;
    config_id: string;
    item: I;
    type: T;
}

export interface LocalFeedItemMap {
    [FEED_TYPE.CONVERSATION]: ExctactFeedItem<LocalFeed, FEED_TYPE.CONVERSATION>; 
}

export interface GlobalFeedItemMap {
    [FEED_TYPE.USER]: ExctactFeedItem<GlobalFeed, FEED_TYPE.USER>;
}

export interface FeedUpdateParams {
    lastActionAt?: string;
    itemId: string;
    lastMessage?: IMessage;
    shouldSort?: boolean;
}

export interface FeedUnreadCounterEvent {
    itemId: string;
    count?: number;
    action: 'set' | 'dec';
    ctx: FEED_TYPE.CONVERSATION;
}

export interface ConversationFeed {
    _id: string;
    recipient: Recipient;
    unreadMessages?: number;
    lastMessage?: IMessage;
    participantsTyping?: Array<TypingParticipant>;
};
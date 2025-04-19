import { Message } from "@/entities/Message/model/types";
import { Avatar, PRESENCE } from "@/entities/profile/model/types";
import { Conversation } from "@/pages/Conversation/model/types";
import { TypingParticipant } from "@/shared/ui/Typography";
import { ExctactFeedItem, GlobalFeed, LocalFeed } from "@/widgets/Sidebar/model/types";

export interface LocalFeedItemMap {
    [FeedTypes.CONVERSATION]: ExctactFeedItem<LocalFeed, FeedTypes.CONVERSATION>; 
}

export interface GlobalFeedItemMap {
    [FeedTypes.USER]: ExctactFeedItem<GlobalFeed, FeedTypes.USER>;
}

export type LocalFeedType = { [K in keyof LocalFeedItemMap]: (item: LocalFeedItemMap[K]) => React.ReactNode };
export type LocalFiltersType = { [K in keyof LocalFeedItemMap]: (item: LocalFeedItemMap[K], value: string) => boolean };

export type GlobalFeedType = { [K in keyof GlobalFeedItemMap]: (item: GlobalFeedItemMap[K]) => React.ReactNode };
export type GlobalFiltersType = { [K in keyof GlobalFeedItemMap]: (item: GlobalFeedItemMap[K], local: Array<LocalFeed>) => boolean };

export enum FeedTypes {
    CONVERSATION = 'Conversation',
    USER = 'User',
}

export interface SearchUser {
    _id: string;
    name: string;
    isOfficial: boolean;
    avatar?: Avatar;
    presence: PRESENCE;
    login: string;
}

export enum FEED_EVENTS {
    CREATE = 'feed.create',
    UPDATE = 'feed.update',
    DELETE = 'feed.delete',
    UNREAD_COUNTER = 'feed.unread.counter',
    USER_PRESENCE = 'feed.user.presence',
    START_TYPING = 'feed.start.typing',
    STOP_TYPING = 'feed.stop.typing'
}

export type ConversationFeed = Pick<Conversation, '_id' | 'recipient'> & {
    unreadMessages?: number;
    lastMessage?: Message;
    participantsTyping?: Array<TypingParticipant>;
};

export type UserFeed = SearchUser & { type: FeedTypes.USER };
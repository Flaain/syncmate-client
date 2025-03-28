import { Message } from "@/entities/Message/model/types";
import { Avatar, PRESENCE } from "@/entities/profile/model/types";
import { Conversation } from "@/pages/Conversation/model/types";
import { TypingParticipant } from "@/shared/ui/Typography";

export type Feed = Array<ConversationFeed | UserFeed>;
export type FeedItem = ConversationFeed | UserFeed | AdsFeed;

export enum FeedTypes {
    CONVERSATION = 'Conversation',
    USER = 'User',
    ADS = "ADS",
    CLOUD = "Cloud",
    CHANNEL = "Channel"
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

export interface AdsFeed {
    _id: string;
    link: string;
    name: string;
    avatar?: Omit<Avatar, '_id'>;
    description: string;
}
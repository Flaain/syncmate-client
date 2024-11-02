import { Conversation } from "@/pages/Conversation/model/types";
import { Avatar, Group, SearchUser, TypingParticipant } from "@/shared/model/types";

export type Feed = Array<ConversationFeed | GroupFeed | UserFeed>;
export type FeedItem = ConversationFeed | GroupFeed | UserFeed | AdsFeed;

export enum FeedTypes {
    CONVERSATION = 'Conversation',
    GROUP = 'Group',
    USER = 'User',
    ADS = "ADS"
}

export enum FEED_EVENTS {
    CREATE_MESSAGE = 'feed.create.message',
    EDIT_MESSAGE = 'feed.edit.message',
    DELETE_MESSAGE = 'feed.delete.message',
    CREATE = 'feed.create',
    DELETE = 'feed.delete',
    USER_PRESENCE = 'feed.user.presence',
    START_TYPING = 'feed.start.typing',
    STOP_TYPING = 'feed.stop.typing'
}

export interface FeedWrapper<T> {
    _id: string;
    item: T;
    lastActionAt: string;
    type: FeedTypes
}

export type ConversationFeed = Pick<Conversation, '_id' | 'lastMessage' | 'recipient'> & {
    participantsTyping?: Array<TypingParticipant>;
};

export type GroupFeed = Pick<Group, '_id' | 'lastMessage' | 'isOfficial' | 'name' | 'login'> & {
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
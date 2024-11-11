import { Avatar, PRESENCE } from "@/entities/profile/model/types";
import { Conversation } from "@/pages/Conversation/model/types";
import { Group } from "@/pages/Group/model/types";
import { TypingParticipant } from "@/shared/ui/Typography";

export type Feed = Array<ConversationFeed | GroupFeed | UserFeed>;
export type FeedItem = ConversationFeed | GroupFeed | UserFeed | AdsFeed;

export enum FeedTypes {
    CONVERSATION = 'Conversation',
    GROUP = 'Group',
    USER = 'User',
    ADS = "ADS",
    CLOUD = "Cloud",
    CHANNEL = "Channel"
}

export interface SearchUser {
    _id: string;
    name: string;
    isOfficial: boolean;
    presence: PRESENCE;
    login: string;
}

export enum FEED_EVENTS {
    CREATE = 'feed.create',
    UPDATE = 'feed.update',
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
export type GroupGlobalFeed = GroupFeed & { type: FeedTypes.GROUP };

export interface AdsFeed {
    _id: string;
    link: string;
    name: string;
    avatar?: Omit<Avatar, '_id'>;
    description: string;
}
import { Message } from '@/entities/Message/model/types';
import { Avatar, Profile } from '@/entities/profile/model/types';
import { DataWithCursor } from '@/shared/model/types';

export enum DisplayAs {
    PARTICIPANT = 'participant',
    JOIN = 'join',
    REQUEST = 'request',
    GUEST = 'guest'
}

export interface GroupStore {
    group: Omit<Group, 'messages'>;
}

export interface GroupParticipant {
    _id: string;
    name?: string;
    avatar?: Avatar;
    user: Pick<Profile, '_id' | 'name' | 'avatar' | 'lastSeenAt'>;
}

export interface Group {
    _id: string;
    name: string;
    login: string;
    avatar?: Avatar;
    messages: DataWithCursor<Message>;
    participants: number;
    isOfficial: boolean;
    isPrivate: boolean;
    displayAs: DisplayAs;
    me?: GroupParticipant;
    createdAt: string;
    updatedAt: string;
}
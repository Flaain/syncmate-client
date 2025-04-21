import { z } from 'zod';

import { IMessage } from '@/entities/Message';

import { nameSchema } from '../constants';
import { ChatStore } from '../lib/providers/chat/types';

export type SchemaNameType = z.infer<typeof nameSchema>;
export type SidebarMenus = 'settings';
export type RequestStatuses = 'idle' | 'loading' | 'error';
export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'isDeleted' | 'presence' | 'status' | 'avatar'>;

export enum ChatType {
    CONVERSATION = 'conversation',
    GROUP = 'group',
}

export enum PRESENCE {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

export enum OutletDetailsTypes {
    EMAIL = 'email',
    PHONE = 'phone',
    LINK = 'link',
    BIO = 'bio',
    LOGIN = 'login'
}

export interface SidebarMenuProps { 
    onClose: () => void, 
    backToParent: () => void
}

export interface Avatar {
    _id: string;
    url: string;
}

export interface Profile {
    _id: string;
    name: string;
    login: string;
    email: string;
    presence: PRESENCE;
    status?: string;
    avatar?: Avatar;
    lastSeenAt: string;
    isOfficial: boolean;
    isPrivate: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DataWithCursor<T> {
    data: Array<T>;
    nextCursor: string | null;
}

export type SetStateInternal<T> = {
    _(partial: T | Partial<T> | {
        _(state: T): T | Partial<T>;
    }['_'], replace?: false): void;
    _(state: T | {
        _(state: T): T;
    }['_'], replace: true): void;
}['_'];

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface OutletDetailsButtonProps {
    type: OutletDetailsTypes;
    data: string;
}

export enum USER_EVENTS {
    PRESENCE = 'user.presence',
    ONLINE = 'user.online',
    OFFLINE = 'user.offline'
}

export interface ActionsProvider<T> {
    set: SetStateInternal<T>;
    get: () => T;
    setChat: SetStateInternal<ChatStore>;
    getChat: () => ChatStore
}

export interface DeleteMessageEventParams {
    lastMessage: IMessage;
    lastMessageSentAt: string;
    feedId: string;
}

export enum UserCheckType {
    EMAIL = 'email',
    LOGIN = 'login'
}

export type UserCheckParams = { type: UserCheckType.EMAIL; email: string } | { type: UserCheckType.LOGIN; login: string };

export interface Pagination {
    query: string;
    page?: number;
    limit?: number;
}

export interface WrappedInPagination<T> {
    items: Array<T>;
    meta: {
        total_items: number;
        remaining_items: number;
        total_pages: number;
        current_page: number;
        next_page: number | null;
    }
}
import { Message } from '@/entities/Message/model/types';
import { ChatStore } from '../lib/providers/chat/types';

export enum ChatType {
    CONVERSATION = 'conversation',
    GROUP = 'group',
}

export type RequestStatuses = 'idle' | 'loading' | 'error';

export enum OutletDetailsTypes {
    EMAIL = 'email',
    PHONE = 'phone',
    LINK = 'link',
    BIO = 'bio',
    LOGIN = 'login'
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
    lastMessage: Message;
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
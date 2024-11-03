import { Message } from '@/entities/Message/model/types';

export enum ChatType {
    CONVERSATION = 'conversation',
    GROUP = 'group',
}

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

export interface DeleteMessageEventParams {
    lastMessage: Message;
    lastMessageSentAt: string;
    id: string;
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
    total_items: number;
    current_page: number;
    total_pages: number;
    remaining_items: number;
}
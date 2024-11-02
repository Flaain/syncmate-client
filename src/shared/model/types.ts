import React from 'react';
import { Message } from '@/entities/Message/model/types';
import { Socket } from 'socket.io-client';
import { AppException } from '../api/error';

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

export type Recipient = Pick<Profile, '_id' | 'isOfficial' | 'email' | 'name' | 'login' | 'lastSeenAt' | 'isPrivate' | 'presence' | 'status' | 'avatar'>;
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithParams<T = Record<string, unknown>> = T & { params?: RequestParams; signal?: AbortSignal };
export type MessageFormState = 'send' | 'edit' | 'reply';

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

export interface OutletDetailsButtonProps {
    type: OutletDetailsTypes;
    data: string;
}

export interface GroupParticipant {
    _id: string;
    name: string;
    email: string;
    userId: string;
}

export interface Group {
    _id: string;
    name: string;
    login: string;
    participants: Array<GroupParticipant>;
    isOfficial?: boolean;
    messages: Array<Message>;
    lastMessage?: Message;
    lastMessageSentAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface SheetProps {
    children: React.ReactNode;
    closeHandler: () => void;
    withHeader?: boolean;
    direction?: 'left' | 'right';
    title?: string;
}

export type TypographyVariant = 'primary' | 'secondary' | 'commerce' | 'error';
export type TypographySize = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TypographyAlign = 'left' | 'center' | 'right';

export interface TypingParticipant {
    _id: string;
    name: string;
}

export interface TypographyVariants {
    variant: Record<TypographyVariant, string>;
    size: Record<TypographySize, string>;
    weight: Record<TypographyWeight, string>;
}

export interface BaseTypographyProps {
    variant?: TypographyVariant;
    size?: TypographySize;
    weight?: TypographyWeight;
    align?: TypographyAlign;
}

export type PolymorphicRef<T extends React.ElementType> = React.Ref<T> | React.RefObject<T>;

export type PropsOf<T extends React.ElementType> = React.ComponentPropsWithRef<T>;

export type PolymorphicProps<T extends React.ElementType = React.ElementType, TProps = object> = {
    as?: T;
} & TProps &
    Omit<PropsOf<T>, keyof TProps | 'as' | 'ref'> & { ref?: PolymorphicRef<T> };

export type TypographyProps<T extends React.ElementType = 'span'> = PolymorphicProps<T, BaseTypographyProps>;

export type TypographyComponent = <T extends React.ElementType = 'span'>(
    props: PolymorphicProps<T, TypographyProps<T>>
) => React.ReactNode;

export interface SearchUser {
    _id: string;
    name: string;
    isOfficial: boolean;
    presence: PRESENCE;
    login: string;
}

export interface AvatarByNameProps extends React.HTMLAttributes<HTMLSpanElement> {
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
    isOnline?: boolean;
}

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
    callback: () => Promise<void> | void;
    deps: React.DependencyList;
}

export interface Draft {
    value: string;
    state: MessageFormState;
    selectedMessage?: Message;
}

export enum USER_EVENTS {
    PRESENCE = 'user.presence',
    ONLINE = 'user.online',
    OFFLINE = 'user.offline'
}

export enum PRESENCE {
    ONLINE = 'online',
    OFFLINE = 'offline'
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

export type UserCheckParams =
    | { type: UserCheckType.EMAIL; email: string }
    | { type: UserCheckType.LOGIN; login: string };

export interface Meta<T> {
    items: T;
    total_items: number;
    current_page: number;
    total_pages: number;
    remaining_items: number;
}

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

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    skeleton?: React.ReactNode;
}

export interface PreAnimatedSkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
    animate?: boolean;
}

export interface LayoutStore {
    drafts: Map<string, Draft>;
    isSheetOpen: boolean;
}

export type Listeners = Map<keyof GlobalEventHandlersEventMap, Set<(event: any) => void>>

export interface EventsStore {
    listeners: Map<any, any>;
    addEventListener<E extends keyof GlobalEventHandlersEventMap>(type: E, listener: (event: GlobalEventHandlersEventMap[E]) => void): () => void;
}

export interface SocketStore {
    socket: Socket;
    isConnected: boolean;
}
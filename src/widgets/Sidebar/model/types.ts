import { Message } from '@/entities/Message/model/types';
import { WrappedInPagination } from '@/shared/model/types';
import { ConversationFeed, FeedTypes, UserFeed } from '@/widgets/Feed/model/types';

export type ExctactFeedItem<T, U extends FeedTypes> = Extract<T, { type: U }>;
export type LocalFeed = LocalFeedItemWrapper<FeedTypes.CONVERSATION, ConversationFeed>;
export type GlobalFeed = UserFeed;

export interface FeedUpdateParams {
    lastActionAt?: string;
    itemId: string;
    lastMessage?: Message;
    shouldSort?: boolean;
}

export interface SidebarMenuProps { 
    onBackCallback: () => void, 
    backToParent: (m: any) => void
}

export interface LocalFeedItemWrapper<T extends FeedTypes, I> {
    _id: string;
    lastActionAt: string;
    createdAt: string;
    config_id: string;
    item: I;
    type: T;
}

export interface FeedUnreadCounterEvent {
    itemId: string;
    count?: number;
    action: 'set' | 'dec';
    ctx: 'conversation';
}

export interface SidebarAnouncement {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export interface UseSidebarEventsProps {
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed>>>;
}

export interface LocalResults {
    feed: Array<LocalFeed>;
    nextCursor: string | null;
}

export interface SidebarStore {
    localResults: LocalResults;
    abortController: AbortController;
    globalResults: WrappedInPagination<GlobalFeed> | null;
    localResultsError: string | null;
    searchRef: React.RefObject<HTMLInputElement>;
    isSearching: boolean;
    searchValue: string;
    actions: {
        resetSearch: () => void;
        handleLogout: () => Promise<void>;
        handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
        delayedSearch: (value: string) => void;
        getFeed: (signal?: AbortSignal) => Promise<void>;
    };
}
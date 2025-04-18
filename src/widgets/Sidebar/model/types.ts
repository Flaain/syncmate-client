import { Message } from '@/entities/Message/model/types';
import { WrappedInPagination } from '@/shared/model/types';
import { AdsFeed, ConversationFeed, FeedTypes, UserFeed } from '@/widgets/Feed/model/types';

export interface FeedUpdateParams {
    lastActionAt?: string;
    itemId: string;
    lastMessage?: Message;
    shouldSort?: boolean;
}

export interface LocalFeedItemWrapper<T extends FeedTypes, I extends ConversationFeed | AdsFeed> {
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

export type ExctactLocalFeedItem<T extends FeedTypes> = Extract<LocalFeed, { type: T }>;

export type LocalFeed =
    | LocalFeedItemWrapper<FeedTypes.CONVERSATION, ConversationFeed>
    | LocalFeedItemWrapper<FeedTypes.ADS, AdsFeed>;

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
    globalResults: WrappedInPagination<UserFeed> | null;
    localResultsError: string | null;
    searchRef: React.RefObject<HTMLInputElement | null>;
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
import { Message } from '@/entities/Message/model/types';
import { WrappedInPagination } from '@/shared/model/types';
import { AdsFeed, ConversationFeed, FeedTypes, GroupFeed, GroupGlobalFeed, UserFeed } from '@/widgets/Feed/types';

export interface FeedUpdateParams {
    lastActionAt?: string;
    itemId: string;
    lastMessage?: Message;
    shouldSort?: boolean;
}

export interface LocalFeedItemWrapper<T extends FeedTypes, I extends ConversationFeed | GroupFeed | AdsFeed> {
    _id: string;
    lastActionAt: string;
    createdAt: string;
    item: I;
    type: T;
}

export type ExctactLocalFeedItem<T extends FeedTypes> = Extract<LocalFeed, { type: T }>;

export type LocalFeed =
    | LocalFeedItemWrapper<FeedTypes.CONVERSATION, ConversationFeed>
    | LocalFeedItemWrapper<FeedTypes.GROUP, GroupFeed>
    | LocalFeedItemWrapper<FeedTypes.ADS, AdsFeed>;

export interface SidebarAnouncement {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export interface UseSidebarEventsProps {
    setLocalResults: React.Dispatch<React.SetStateAction<Array<ConversationFeed | GroupFeed>>>;
}

export interface LocalResults {
    feed: Array<LocalFeed>;
    nextCursor: string | null;
}

export interface SidebarStore {
    localResults: LocalResults;
    globalResults: WrappedInPagination<UserFeed | GroupGlobalFeed> | null;
    localResultsError: string | null;
    searchRef: React.RefObject<HTMLInputElement>;
    isSearching: boolean;
    searchValue: string;
    actions: {
        resetSearch: () => void;
        handleLogout: () => Promise<void>;
        handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
        delayedSearch: (value: string) => void;
        getFeed: () => Promise<void>;
    };
}
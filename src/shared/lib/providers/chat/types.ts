import { CHAT_TYPE, DataWithCursor, Message, SetStateInternal } from '@/shared/model/types';

export type ChatMode = 'default' | 'selecting';

export interface ChatStore {
    params: ChatParams;
    isContextActionsBlocked: boolean;
    showAnchor: boolean;
    mode: ChatMode;
    showDetails: boolean;
    chatInfo: any; // TODO: change type
    selectedMessages: Map<string, Message>;
    messages: DataWithCursor<Map<string, Message>>;
    isUpdating: boolean;
    refs: {
        listRef: React.RefObject<HTMLDivElement | null>;
        textareaRef: React.RefObject<HTMLTextAreaElement | null>;
        lastMessageRef: { current: HTMLLIElement | null };
        bottomPlaceholderRef: { current: HTMLDivElement | null };
    };
    actions: {
        setChat: SetStateInternal<ChatStore>;
        getChat: () => ChatStore;
        getChatInfo: () => any; // TODO: change type
        handleSelectMessage: (message: Message) => void;
        handleOptimisticUpdate: (message: string) => {
            onSuccess: (data: Message) => void;
            onError: (error: unknown, message?: string) => void;
            signal?: AbortSignal;
        };
    };
}

export interface ChatParams {
    id: string;
    query: Record<string, any>;
    type: CHAT_TYPE;
}

export interface ChatProviderProps {
    readonly children: React.ReactNode;
}

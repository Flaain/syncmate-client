import { Message, SourceRefPath } from '@/entities/Message/model/types';
import { DataWithCursor, SetStateInternal } from '@/shared/model/types';

export type ChatMode = 'default' | 'selecting';

export interface ChatStore {
    params: ChatParams;
    isContextActionsBlocked: boolean;
    showAnchor: boolean;
    mode: ChatMode;
    showDetails: boolean;
    selectedMessages: Map<string, Message>;
    messages: DataWithCursor<Message>;
    refs: {
        listRef: React.RefObject<HTMLUListElement | null>;
        textareaRef: React.RefObject<HTMLTextAreaElement | null>;
        lastMessageRef: { current: HTMLLIElement | null };
    };
    actions: {
        setChat: SetStateInternal<ChatStore>;
        getChat: () => ChatStore;
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
    type: SourceRefPath;
}

export interface ChatProviderProps {
    readonly children: React.ReactNode;
}

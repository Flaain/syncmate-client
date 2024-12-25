import { Message } from '@/entities/Message/model/types';
import { SetStateInternal } from '@/shared/model/types';

export type ChatMode = 'default' | 'selecting';

export interface ChatStore {
    params: ChatParams;
    isContextActionsBlocked: boolean;
    showAnchor: boolean;
    mode: ChatMode;
    showDetails: boolean;
    selectedMessages: Map<string, Message>;
    isPreviousMessagesLoading: boolean;
    previousMessagesCursor: string | null;
    messages: Array<Message>;
    refs: {
        listRef: React.RefObject<HTMLUListElement>;
        textareaRef: React.RefObject<HTMLTextAreaElement>;
        lastMessageRef: { current: HTMLLIElement | null };
    };
    actions: {
        setChat: SetStateInternal<ChatStore>;
        getChat: () => ChatStore;
        handleSelectMessage: (message: Message) => void;
    };
}

export interface ChatParams {
    id: string;
    query: Record<string, any>;
    type: 'conversation' | 'group';
}

export interface ChatProviderProps {
    readonly children: React.ReactNode;
}
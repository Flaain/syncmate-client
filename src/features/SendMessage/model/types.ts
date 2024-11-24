import { Message } from '@/entities/Message/model/types';
import { Draft } from '@/shared/model/store';

export type MessageFormState = 'send' | 'edit' | 'reply';
export type OptimisticFunc = (
    message: string,
    currentDraft: Draft | undefined
) => { onSuccess: (data: Message) => void; onError: (error: unknown, message?: string) => void; signal?: AbortSignal };

export interface MessageTopBarProps {
    onClose: () => void;
    title: string;
    mainIconSlot: React.ReactNode;
    preventClose?: boolean;
    description?: string;
    closeIconSlot?: React.ReactNode;
}

export interface UseMessageParams {
    onChange?: (value: string) => void;
    handleTypingStatus?: (action: MessageFormState, reset?: boolean) => void;
    onOptimisticUpdate: OptimisticFunc;
    restrictMessaging?: Array<{ reason: boolean; message: string }>;
}

export interface EmojiMartData {
    categories: Category[];
    emojis: { [key: string]: Emoji };
    aliases: { [key: string]: string };
    sheet: Sheet;
}

export interface Category {
    id: string;
    emojis: string[];
}

export interface EmojiData {
    aliases: Array<string>;
    id: string;
    keywords: Array<string>;
    name: string;
    native: string;
    shortcodes: string;
    skin: number;
    unified: string;
}

export interface Emoji {
    id: string;
    name: string;
    keywords: string[];
    skins: Skin[];
    version: number;
    emoticons?: string[];
}

export interface Skin {
    unified: string;
    native: string;
    x?: number;
    y?: number;
}

export interface Sheet {
    cols: number;
    rows: number;
}

import { MessageFormState } from "@/shared/model/types";

export interface MessageTopBarProps {
    onClose: () => void;
    state: MessageFormState;
    description: string;
    preventClose?: boolean;
}

export interface UseMessageParams {
    onChange?: (value: string) => void;
    handleTypingStatus?: (action: MessageFormState, reset?: boolean) => void;
    restrictMessaging?: Array<{ reason: boolean; message: string }>;
}

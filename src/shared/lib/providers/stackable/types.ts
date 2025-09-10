import { TimeoutType } from "@/shared/model/types";

export interface StackableItemProps {
    id: string;
    content: React.ReactNode;
    headerContent?: React.ReactNode;
    containerClassName?: string;
    title?: string;
    onClose?: () => void;
}

export interface StackableNodesRef {
    node: HTMLDivElement; 
    isClosing?: boolean; 
    openTimeoutId: TimeoutType | null;
    closeTimeoutId: TimeoutType | null;
}
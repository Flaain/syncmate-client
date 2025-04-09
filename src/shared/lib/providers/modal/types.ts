import React from "react";

export interface ModalProps extends Omit<ModalConfig, 'content'> {
    disabled?: boolean;
    closeHandler: () => void;
    onRemove: () => void;
    _shouldRemove?: boolean;
    children: React.ReactNode;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    _shouldRemove?: boolean;
    disabled?: boolean;
}

export interface AsyncActionOptions<T> {
    closeOnError?: boolean;
    closeOnSuccess?: boolean;
    disableOnPending?: boolean;
    onResolve?: (data: T) => void;
    onReject?: (error: unknown) => void;
}

export interface ModalStore {
    isModalDisabled: boolean;
    modals: Array<ModalConfig>;
    actions: {
        onCloseModal: () => void;
        onRemoveModal: () => void;
        onOpenModal: (config: ModalConfig) => void;
        onAsyncActionModal: <T>(cb: () => Promise<T>, options?: AsyncActionOptions<T>) => Promise<void>;
    }
}

export interface ModalConfig {
    id?: string;
    title?: string;
    withCloseButton?: boolean;
    withHeader?: boolean;
    bodyClassName?: string;
    content: React.ReactNode;
    _shouldRemove?: boolean;
    closeHandler?: (modal?: ModalConfig) => void;
}
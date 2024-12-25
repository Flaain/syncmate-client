import React from "react";

export interface ModalProps extends Omit<ModalConfig, 'content'> {
    disabled?: boolean;
    closeHandler: () => void;
    children: React.ReactNode;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
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
        onOpenModal: (config: ModalConfig) => void;
        onCloseModal: (modal?: ModalConfig) => () => void;
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
    closeHandler?: (modal?: ModalConfig) => void;
}
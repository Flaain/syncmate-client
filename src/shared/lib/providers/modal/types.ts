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

/**
 * Options for configuring the behavior of an asynchronous action.
 *
 * @template T - The type of data expected when the action resolves successfully.
 */
export interface AsyncActionOptions<T> {
    /**
     * Whether to close the modal or UI element when an error occurs.
     * @default false
     */
    closeOnError?: boolean;

    /**
     * Whether to close the modal or UI element when the action completes successfully.
     * @default true
     */
    closeOnSuccess?: boolean;

    /**
     * Whether to disable the action while it is pending.
     * This can be used to prevent duplicate submissions or interactions.
     * @default false
     */
    disableOnPending?: boolean;

    /**
     * A callback function to be executed when the action resolves successfully.
     * @param data - The resolved data of type `T`.
     */
    onResolve?: (data: T) => void;

    /**
     * A callback function to be executed when the action is rejected or encounters an error.
     * @param error - The error encountered during the action.
     */
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

/**
 * Configuration options for a modal component.
 */
export interface ModalConfig {
    /**
     * Optional unique identifier for the modal.
     */
    id?: string;

    /**
     * Title of the modal, displayed in the header if provided.
     */
    title?: string;

    /**
     * Determines whether a close button should be displayed in the modal.
     * @default false
     */
    withCloseButton?: boolean;

    /**
     * Determines whether the modal should include a header section.
     * @default false
     */
    withHeader?: boolean;

    /**
     * Additional CSS class name(s) to apply to the modal body.
     */
    bodyClassName?: string;

    /**
     * The content to be rendered inside the modal.
     */
    content: React.ReactNode;

    /**
     * Flag indicating whether the modal should be removed.
     * This is used for **internal** purposes and should not be set manually.
     */
    _shouldRemove?: boolean;

    /**
     * Callback function triggered when the modal is closed.
     * @param modal - The configuration of the modal being closed.
     */
    closeHandler?: (modal?: ModalConfig) => void;
}
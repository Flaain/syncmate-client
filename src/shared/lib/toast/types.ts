export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'message';
export type ToastOptions = Partial<Omit<IToast, 'message' | 'type'>>;

export interface IToast {
    id: number | string;
    type?: ToastType;
    message: string | React.ReactNode;
    description?: string | React.ReactNode;
    duration: number;
    autoClose?: boolean;
    recalculateRemainingTime?: boolean;
    shouldPauseOnHover?: boolean;
    onClose?: (toast: IToast) => void;
}

export interface ToastProps {
    toast: IToast;
    removeToast: () => void;
}

export interface ToastConfig {
    ref: HTMLDivElement | null;
    start: number;
    remaining: number;
    id: NodeJS.Timeout | null;
}
import { Observer } from "@/shared/model/observer";

import { IToast, ToastOptions } from "./types";

export class Toast extends Observer<IToast> {
    private readonly TOAST_DURATION = 3600;
    private _toast: IToast | null = null;

    constructor() {
        super()
    }

    private get toast() {
        return this._toast;
    }

    private set toast(toast: IToast | null) {
        this._toast = toast;
    }

    private create = (toast: IToast) => {
        this.toast = toast;

        this.notify(toast);
    }

    message = (message: IToast['message'], options?: ToastOptions) => {
        this.create({
            ...options,
            message,
            type: "message",
            id: options?.id ?? window.crypto.randomUUID(),
            duration: options?.duration ?? this.TOAST_DURATION,
        });
    };

    error = (message: IToast['message'], options?: ToastOptions) => {
        this.create({
            ...options,
            message,
            type: "error",
            id: options?.id ?? window.crypto.randomUUID(),
            duration: options?.duration ?? this.TOAST_DURATION,
        });
    };

    success = (message: IToast['message'], options?: ToastOptions) => {
        this.create({
            ...options,
            message,
            type: "success",
            id: options?.id ?? window.crypto.randomUUID(),
            duration: options?.duration ?? this.TOAST_DURATION,
        });
    };

    removeToast = () => {
        this.toast = null
    };
}
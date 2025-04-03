import { Observer } from "@/shared/model/observer";

export class Toast extends Observer<any> {
    private readonly TOAST_DURATION = 3600;
    private _toast: any = null;

    constructor() {
        super()
    }

    private get toast() {
        return this._toast;
    }

    private set toast(toast: any) {
        this._toast = toast;
    }

    private create = (toast: any) => {
        this.toast = toast;

        this.notify(toast);
    }

    message = (message: string | React.ReactNode, options?: any) => {
        this.create({
            ...options,
            message,
            id: options?.id ?? window.crypto.randomUUID(),
            duration: options?.duration ?? this.TOAST_DURATION,
        });
    };

    error = (message: string | React.ReactNode, options?: any) => {
        this.create({
            ...options,
            message,
            type: "error",
            id: options?.id ?? window.crypto.randomUUID(),
            duration: options?.duration ?? this.TOAST_DURATION,
        });
    };

    success = (message: string | React.ReactNode, options?: any) => {
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
import { Typography } from "@/shared/ui/Typography";
import React from "react";
import { cn } from "../utils/cn";
import { toast as toastInstance } from "./index";
import { IToast, ToastConfig, ToastProps } from "./types";

export const Toaster = () => {
    const [toast, setToast] = React.useState<IToast | null>(null);

    React.useEffect(() => {
        const unsubscribe = toastInstance.subscribe((toast) => setToast((prev) => (prev?.id === toast.id ? null : toast)));

        return () => {
            unsubscribe();
        };
    }, []);

    const handleRemoveToast = () => {
        setToast(null);

        toast?.onClose?.(toast);

        toastInstance.removeToast();
    }

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
            {toast && <Toast toast={toast} removeToast={handleRemoveToast} />}
        </div>
    )
}

export const Toast = ({ toast, removeToast }: ToastProps) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);

    const config = React.useRef<ToastConfig>({
        ref: null,
        start: 0,
        remaining: toast.duration,
        id: null,
    });

    const handleInteraction = React.useCallback(({ type }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        type === 'mouseenter' ? pauseTimer() : startTimer();
    }, []);

    const startTimer = React.useCallback(() => {
        config.current.start = Date.now();
        config.current.id = setTimeout(setShouldRemove, toast.recalculateRemainingTime ? config.current.remaining : toast.duration, true);
    }, [toast]);

    const pauseTimer = React.useCallback(() => {
        clearTimeout(config.current.id!);
        
        config.current = {
          ...config.current,
          id: null,
          remaining: config.current.remaining - (Date.now() - config.current.start)
        };
      }, []);

    React.useEffect(() => {
        config.current.remaining = toast.duration;
        
        startTimer();

        return () => {
            config.current?.id && clearTimeout(config.current.id);
        };
    }, [toast]);

    return (
        <div
            ref={(node) => (config.current.ref = node)}
            className={cn(
                shouldRemove ? 'fill-mode-forwards animate-out fade-out-0' : 'animate-in fade-in-0',
                'pointer-events-all select-none py-2 px-4 rounded-[10px] bg-[#000000a8] backdrop-blur-xl',
            )}
            onClick={() => setShouldRemove(true)}
            onAnimationEnd={() => shouldRemove && removeToast()}
            {...(toast.shouldPauseOnHover && { onMouseEnter: handleInteraction, onMouseLeave: handleInteraction })}
        >
            <Typography as='p' size='base' weight="medium">{toast.message}</Typography>
        </div>
    );
}
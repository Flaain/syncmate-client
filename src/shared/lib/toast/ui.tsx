import { Typography } from "@/shared/ui/Typography";
import React from "react";
import { cn } from "../utils/cn";
import { toast as toastInstance } from "./index";

export const Toaster = () => {
    const [toast, setToast] = React.useState<any>(null);

    React.useEffect(() => {
        const unsubscribe = toastInstance.subscribe((toast) => setToast(toast));

        return () => {
            unsubscribe();
        }
    }, []);

    const handleRemoveToast = () => {
        setToast(null);

        toastInstance.removeToast();
    }

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none">
            {toast && <Toast toast={toast} removeToast={handleRemoveToast} />}
        </div>
    )
}

export const Toast = ({ toast, removeToast }: any) => {
    const [isInteracting, setIsInteracting] = React.useState(false);
    
    const toastRef = React.useRef<HTMLDivElement>(null);
    const timerRef = React.useRef<{ start: number; end: number; remaining: number; id: NodeJS.Timeout | null }>({
        start: 0,
        end: 0,
        remaining: toast.duration,
        id: null,
    });

    const startTimer = React.useCallback(() => {
        timerRef.current.start = Date.now();
        timerRef.current.id = setTimeout(removeToast, toast.recalculateRemainingTime ? timerRef.current.remaining : toast.duration);
    }, [toast]);

    const pauseTimer = React.useCallback(() => {
        if (!timerRef.current.id) return;
        
        clearTimeout(timerRef.current.id);

        const end = Date.now();
        
        timerRef.current = {
          ...timerRef.current,
          end,
          id: null,
          remaining: timerRef.current.remaining - (end - timerRef.current.start),
        };
      }, []);

    React.useEffect(() => {
        timerRef.current.remaining = toast.duration;
        
        startTimer();

        return () => {
            timerRef.current?.id && clearTimeout(timerRef.current.id);
        };
    }, [toast]);

    React.useEffect(() => {
        if (!toast.shouldPauseOnHover) return;
        
        isInteracting ? pauseTimer() : (!timerRef.current.id && startTimer());
    }, [toast, isInteracting]);

    return (
        <div
            ref={toastRef}
            className={cn(
                'pointer-events-all transition-opacity duration-200 ease-in-out py-2 px-4 rounded-[10px] bg-[#000000a8] backdrop-blur-xl',
                toast ? 'opacity-100' : 'opacity-0'
            )}
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
        >
            <Typography as='p' size='base' weight="medium">{toast.message}</Typography>
        </div>
    );
}
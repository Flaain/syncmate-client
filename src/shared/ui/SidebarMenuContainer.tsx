import React from 'react';

import { cn } from '@/shared/lib/utils/cn';

interface SidebarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    shouldRemove?: boolean;
    children: React.ReactNode;
    hasActiveMenu?: boolean;
    shouldBack?: boolean;
}

export const SidebarMenuContainer = React.forwardRef<HTMLDivElement, SidebarContainerProps>(
    ({ children, shouldRemove, shouldBack, hasActiveMenu, className, ...rest }, ref) => (
        <div
            ref={ref}
            className={cn(
                'col-start-1 row-start-1 z-10 bg-primary-dark-150',
                shouldRemove ? 'slide-out-to-right-full fill-mode-forwards duration-300 animate-out' : 'slide-in-from-right-full duration-200 animate-in',
                hasActiveMenu && '-translate-x-10',
                className
            )}
            {...rest}
        >
            {children}
        </div>
    )
);

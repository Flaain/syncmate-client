import React from 'react';
import { cn } from '../lib/utils/cn';

export interface OutletContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const OutletContainer = React.forwardRef<HTMLDivElement, OutletContainerProps>(
    ({ children, className, ...rest }, ref) => {
        return (
            <section
                {...rest}
                ref={ref}
                className={cn(
                    'flex w-full overflow-auto dark:bg-primary-dark-200 bg-primary-white z-10 h-svh',
                    className
                )}
            >
                {children}
            </section>
        );
    }
);
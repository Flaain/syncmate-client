import React from "react";

import ArrowLeftIcon from '@/shared/lib/assets/icons/arrow_prev.svg?react';

import { cn } from "../lib/utils/cn";
import { addEventListenerSelector } from "../model/selectors";
import { useEvents } from "../model/store";

import { Button } from "./button";
import { Typography } from "./Typography";

/**
 * Props for the StackableItem component
 */
interface StackableItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The content to be displayed inside the StackableItem.
     */
    children: React.ReactNode;

    /**
     * Indicates whether the StackableItem contains an active menu item.
     * Can be used to apply specific styles or behaviors when a menu item is active.
     * @default false
     */
    hasActiveMenu?: boolean;

    /**
     * Callback function triggered when the back button is clicked.
     */
    onBack?: (remove?: boolean) => void;

    /**
     * Optional. Additional content to render in the header.
     */
    headerContent?: React.ReactNode;

    /**
     * The title to display in the header.
     */
    title?: string;
}

export const StackableItem = React.forwardRef<HTMLDivElement, StackableItemProps>(
    ({ children, onBack, title, headerContent, hasActiveMenu, className, ...rest }, ref) => {
        const addEventListener = useEvents(addEventListenerSelector);

        React.useEffect(() => {
            if (!onBack) return;

            const removeEventListener = addEventListener('keydown', ({ key }) => {
                key === 'Escape' && onBack();
            });

            return () => {
                removeEventListener();
            };
        }, []);

        return (
            <div
                ref={ref}
                className={cn(
                    'col-start-1 row-start-1 transition-transform ease-in-out duration-300 bg-primary-dark z-0 overflow-auto will-change-transform',
                    hasActiveMenu && '-translate-x-24',
                    className
                )}
                {...rest}
            >
                {title && (
                    <div className='flex items-center gap-5 px-4 sticky top-0 !bg-inherit z-[9999] min-h-14 box-border'>
                        <Button ripple variant='ghost' size='icon' intent='secondary' onClick={() => onBack?.()}>
                            <ArrowLeftIcon className='size-6 text-primary-gray' />
                        </Button>
                        <Typography as='h2' variant='primary' size='xl' weight='medium'>
                            {title}
                        </Typography>
                        {headerContent}
                    </div>
                )}
                {children}
            </div>
        );
    }
);
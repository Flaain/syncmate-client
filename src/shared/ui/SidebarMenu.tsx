import React from 'react';

import ArrowLeftIcon from '@/shared/lib/assets/icons/arrow_prev.svg?react';

import { cn } from '../lib/utils/cn';
import { useEvents } from '../model/store';

import { Button } from './button';
import { Typography } from './Typography';

interface SidebarHeaderProps {
    /**
     * The title to display in the sidebar header.
     */
    title: string;

    /**
     * Callback function triggered when the back button is clicked.
     */
    onBack: () => void;

    /**
     * Optional. Additional content to render in the header.
     */
    children?: React.ReactNode;
}

/**
 * Props for the SidebarContainer component, which represents a sidebar menu with optional features.
 */
interface SidebarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Determines whether the sidebar can be closed.
     * If true, a close button or mechanism should be provided.
     * @default true
     */
    closable?: boolean;

    /**
     * Indicates whether the sidebar should be removed from the DOM when closed.
     * If true, the sidebar will be unmounted instead of hidden.
     * @default false
     */
    shouldRemove?: boolean;

    /**
     * The content to be displayed inside the sidebar.
     */
    children: React.ReactNode;

    /**
     * Indicates whether the sidebar contains an active menu item.
     * Can be used to apply specific styles or behaviors when a menu item is active.
     * @default false
     */
    hasActiveMenu?: boolean;

    /**
     * Callback function triggered when the escape key is clicked.
     */
    onBack?: () => void;
}

/**
 * Props for the SidebarMenuButton component, which represents a button in the sidebar menu.
 */
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * The title of the button, typically displayed as the main label.
     */
    title?: string;
    
    count?: number;

    /**
     * Optional. Indicates whether the button is in an active state.
     * @default false
     */
    active?: boolean;

    children?: React.ReactNode;

    /**
     * Optional. A description or additional content to display alongside the button.
     */
    description?: React.ReactNode;

    /**
     * Optional. An icon or visual element to display within the button.
     */
    icon?: React.ReactNode;
}

export const SidebarMenuContainer = React.forwardRef<HTMLDivElement, SidebarContainerProps>(
    ({ children, closable = true, onBack, shouldRemove, hasActiveMenu, className, ...rest }, ref) => {
        const addEventListener = useEvents((state) => state.addEventListener);

        React.useEffect(() => {
            if (!closable || !onBack) return;

            const removeEventListener = addEventListener('keydown', (event) => {
                event.key === 'Escape' && !shouldRemove && onBack();
            });

            return () => {
                removeEventListener();
            };
        }, []);

        return (
            <div
                ref={ref}
                className={cn(
                    className,
                    'col-start-1 row-start-1 bg-primary-dark-150 duration-300 z-0 overflow-auto',
                    shouldRemove ? 'slide-out-to-right-full fill-mode-forwards animate-out' : 'slide-in-from-right-full animate-in',
                    hasActiveMenu && '-translate-x-20'
                )}
                {...rest}
            >
                {children}
            </div>
        );
    }
);

export const SidebarMenuSeparator = ({
    children,
    className,
    ...rest
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest} className={cn('w-full h-[15px] dark:bg-primary-dark-200 my-2 px-8 py-2 box-border dark:text-primary-gray text-sm', className)}>
        {children}
    </div>
);

export const SidebarMenuHeader = ({ children, onBack, title }: SidebarHeaderProps) => {
    return (
        <div className='flex items-center gap-5 px-4 py-2 sticky top-0 dark:bg-primary-dark-150 z-[9999]'>
            <Button variant='ghost' size='icon' className='size-10 rounded-full p-2' onClick={onBack}>
                <ArrowLeftIcon className='size-6 text-primary-gray' />
            </Button>
            <Typography as='h2' variant='primary' size='xl' weight='medium'>
                {title}
            </Typography>
            {children}
        </div>
    );
};

export const SidebarMenuError = ({
    children,
    bgSkeleton
}: {
    bgSkeleton: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className='relative'>
        <div className='absolute flex items-center justify-center inset-0 z-10 bg-primary-dark-150/80'>
            {children}
        </div>
        {bgSkeleton}
    </div>
);

export const SidebarMenuButton = ({
    title,
    count,
    description,
    children,
    active,
    icon,
    className,
    ...rest
}: SidebarMenuButtonProps) => {
    if (!title && !children) throw new Error('At least one prop should be provided: title or children');

    return (
        <Button
            {...rest}
            variant={active ? 'change_later' : 'ghost'}
            className={cn(
                'flex rounded-[10px] justify-start gap-8 py-1 items-center box-border w-full hover:!bg-primary-gray/10',
                description ? 'h-14' : 'h-12',
                className
            )}
        >
            {icon}
            {children || (
                <>
                    {description ? (
                        <div className='flex flex-col items-start'>
                            <Typography weight='medium'>{title}</Typography>
                            {description &&
                                (React.isValidElement(description) ? (
                                    description
                                ) : (
                                    <Typography as='p' variant='secondary' size='sm'>
                                        {description}
                                    </Typography>
                                ))}
                        </div>
                    ) : (
                        <Typography weight='medium'>{title}</Typography>
                    )}
                </>
            )}
            {!!count && (
                <Typography className='ml-auto' variant='secondary'>
                    {count}
                </Typography>
            )}
        </Button>
    );
};
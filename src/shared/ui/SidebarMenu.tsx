import React from 'react';

import { cn } from '../lib/utils/cn';

import { Button } from './button';
import { Typography } from './Typography';

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

export const SidebarMenuSeparator = ({
    children,
    className,
    ...rest
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
    <div
        {...rest}
        className={cn(
            'w-full h-[15px] dark:bg-primary-dark-150 my-2 px-6 py-2 box-border dark:text-primary-gray text-sm',
            className
        )}
    >
        {children}
    </div>
);

export const SidebarMenuError = ({
    children,
    bgSkeleton
}: {
    bgSkeleton: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className='relative h-[calc(100%-56px)]'>
        <div className='absolute flex items-center justify-center inset-0 z-10 bg-primary-dark-150/80'>{children}</div>
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
            ripple
            variant={active ? 'primary' : 'ghost'}
            intent='secondary'
            className={cn(
                'flex rounded-[10px] justify-start gap-8 py-1 items-center box-border w-full',
                description ? 'h-14' : 'h-12',
                className
            )}
        >
            {icon}
            {children || (
                <>
                    {description ? (
                        <span className='flex flex-col items-start'>
                            <Typography weight='medium'>{title}</Typography>
                            {description &&
                                (React.isValidElement(description) ? (
                                    description
                                ) : (
                                    <Typography variant='secondary' size='sm'>
                                        {description}
                                    </Typography>
                                ))}
                        </span>
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

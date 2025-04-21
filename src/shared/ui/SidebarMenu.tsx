import React from "react";

import { ArrowLeft } from "lucide-react";

import { cn } from "../lib/utils/cn";

import { Button } from "./button";
import { Typography } from "./Typography";

interface SidebarHeaderProps {
    title: string;
    onBack: () => void;
    children?: React.ReactNode;
}

interface SidebarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    shouldRemove?: boolean;
    children: React.ReactNode;
    hasActiveMenu?: boolean;
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

export const SidebarMenuContainer = React.forwardRef<HTMLDivElement, SidebarContainerProps>(
    ({ children, shouldRemove, hasActiveMenu, className, ...rest }, ref) => (
        <div
            ref={ref}
            className={cn(
                'col-start-1 row-start-1 z-10 bg-primary-dark-150',
                shouldRemove ? 'slide-out-to-right-full fill-mode-forwards duration-300 animate-out' : 'slide-in-from-right-full duration-300 animate-in',
                hasActiveMenu && '-translate-x-20',
                className
            )}
            {...rest}
        >
            {children}
        </div>
    )
);

export const SidebarMenuHeader = ({ children, onBack, title }: SidebarHeaderProps) => {
    return (
        <div className='flex items-center gap-5 p-4'>
            <Button variant='ghost' size='icon' className='rounded-full p-2' onClick={onBack}>
                <ArrowLeft className='size-5' />
            </Button>
            <Typography as='h2' variant='primary' size='2xl' weight='medium' className='leading-none'>
                {title}
            </Typography>
            {children}
        </div>
    );
};

export const SidebarMenuButton = ({ title, description, icon, className, ...rest }: SidebarMenuButtonProps) => {
    return (
        <Button {...rest} variant='ghost' className={cn('flex rounded-[10px] justify-start gap-8 items-center h-auto box-border py-1 px-4', className)}>
            {icon}
            <div className='flex flex-col items-start'>
                <Typography variant='primary' weight='medium'>
                    {title}
                </Typography>
                {description && (
                    <Typography variant='secondary' size='base'>
                        {description}
                    </Typography>
                )}
            </div>
        </Button>
    )
}
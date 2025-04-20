import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { Typography } from "./Typography";
import { forwardRef } from "react";
import { cn } from "../lib/utils/cn";

interface SidebarHeaderProps {
    title: string;
    onBack: () => void;
    children?: React.ReactNode;
}

interface SidebarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    shouldRemove?: boolean;
    children: React.ReactNode;
    hasActiveMenu?: boolean;
    shouldBack?: boolean;
}

const SidebarMenuContainer = forwardRef<HTMLDivElement, SidebarContainerProps>(
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

const SidebarMenuHeader = ({ children, onBack, title }: SidebarHeaderProps) => {
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

export const SidebarMenu = {
    Container: SidebarMenuContainer,
    Header: SidebarMenuHeader
}
import React from "react";

import { EllipsisVertical } from "lucide-react";

import { useMenuDistance } from "../lib/hooks/useMenuDistance";
import { cn } from "../lib/utils/cn";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";

interface DDMProps extends React.ComponentProps<typeof DropdownMenuContent> {
    children: React.ReactNode;
    trigger?: React.ReactNode;
}

export const DDM = ({ children, trigger, className, ...rest }: DDMProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const ref = React.useRef<HTMLDivElement>(null);

    useMenuDistance({ ref, onClose: () => setIsOpen(false), earlyReturn: !isOpen });

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild={!!trigger} className='outline-none'>
                {trigger || <EllipsisVertical className='hover:opacity-50 transition-opacity ease-in-out duration-200 outline-none dark:text-primary-white text-primary-dark-50' />}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                {...rest}
                className={cn('border-none rounded-lg h-auto backdrop-blur-[50px] dark:bg-menu-background-color z-[999]', className)}
                asChild
                loop
                ref={ref}
                onEscapeKeyDown={(event) => event.stopPropagation()}
            >
                <ul>{children}</ul>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
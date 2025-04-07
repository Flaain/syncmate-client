import { EllipsisVertical } from "lucide-react";
import React from "react";
import { useMenuDistance } from "../lib/hooks/useMenuDistance";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";

interface DDMProps extends React.ComponentProps<typeof DropdownMenuContent> {
    dropdownContent: React.ReactNode;
    trigger?: React.ReactNode;
}

export const DDM = ({ dropdownContent, trigger, ...rest }: DDMProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const ref = React.useRef<HTMLDivElement>(null);

    useMenuDistance({ ref, onClose: () => setIsOpen(false),  earlyReturn: !isOpen, deps: [isOpen] });

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className='hover:opacity-50 transition-opacity ease-in-out duration-200 outline-none'>
                {trigger || <EllipsisVertical className='dark:text-primary-white text-primary-dark-50' />}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                {...rest}
                loop
                ref={ref}
                onEscapeKeyDown={(event) => event.stopPropagation()}
            >
                {dropdownContent}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
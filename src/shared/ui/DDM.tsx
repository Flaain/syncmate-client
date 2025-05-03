import React from "react";

import { EllipsisVertical } from "lucide-react";

import { MAX_POINTER_DISTANCE_DDM } from "../constants";
import { cn } from "../lib/utils/cn";
import { useEvents } from "../model/store";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";

interface DDMProps extends React.ComponentProps<typeof DropdownMenuContent> {
    children: React.ReactNode;
    trigger?: React.ReactNode;
}

export const DDM = ({ children, trigger, className, ...rest }: DDMProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const ref = React.useRef<HTMLDivElement>(null);

    const addEventListener = useEvents((state) => state.addEventListener);
    
    const handleMouseMove = React.useCallback(({ clientX, clientY }: MouseEvent) => {
        if (!ref.current) return;

        const { x, y, width, height } = ref.current.getBoundingClientRect();

        (Math.abs(clientX - (x + width / 2)) > MAX_POINTER_DISTANCE_DDM || Math.abs(clientY - (y + height / 2)) > MAX_POINTER_DISTANCE_DDM) && setIsOpen(false);
    }, []);

    React.useEffect(() => {
        if (!isOpen) return;

        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && setIsOpen(false)
        });

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            removeEventListener();

            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isOpen]);

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
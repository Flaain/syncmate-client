import React from 'react';

import MoreIcon from '@/shared/lib/assets/icons/more.svg?react';

import { useMenuDistance } from '../lib/hooks/useMenuDistance';
import { cn } from '../lib/utils/cn';

import { Button } from './button';
import { DropdownMenu as DDM, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

interface DDMProps extends React.ComponentProps<typeof DropdownMenuContent> {
    children: React.ReactNode;
    trigger?: React.ReactNode;
}

export const DropdownMenu = ({ children, trigger, className, ...rest }: DDMProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const ref = React.useRef<HTMLDivElement>(null);

    useMenuDistance({ ref, onClose: () => setIsOpen(false), earlyReturn: !isOpen });

    return (
        <DDM open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                {trigger || (
                    <Button intent='secondary' variant='ghost' size='icon'>
                        <MoreIcon className='text-primary-gray' />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                {...rest}
                className={cn(
                    'border-none p-0 rounded-lg h-auto box-border backdrop-blur-[50px] dark:bg-menu-background-color z-[999]',
                    className
                )}
                asChild
                loop
                ref={ref}
                onEscapeKeyDown={(event) => event.stopPropagation()}
            >
                <div>{children}</div>
            </DropdownMenuContent>
        </DDM>
    );
};
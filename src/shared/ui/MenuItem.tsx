import { cn } from '../lib/utils/cn';

import { ContextMenuItem } from './context-menu';
import { DropdownMenuItem } from './dropdown-menu';
import { Typography } from './Typography';

interface MenuItemProps {
    type: 'ctx' | 'ddm';
    variant?: 'default' | 'destructive';
    text: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    displayChildrenFrom?: 'left' | 'right';
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}

export const MenuItem = ({
    type,
    description,
    className,
    children,
    displayChildrenFrom,
    variant = 'default',
    onClick,
    text,
    icon
}: MenuItemProps) => {
    const Item = type === 'ctx' ? ContextMenuItem : DropdownMenuItem;

    return (
        <Item
            asChild
            className={cn(
                'active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md hover:bg-primary-gray focus:bg-primary-gray',
                variant === 'destructive' ? 'dark:hover:bg-primary-destructive/10 dark:focus:bg-primary-destructive/10' : 'dark:hover:bg-light-secondary-color dark:focus:bg-light-secondary-color',
                className
            )}
            onClick={onClick}
        >
            <li>
                {children && displayChildrenFrom === 'left' && children}
                {icon}
                <Typography
                    size='sm'
                    weight='medium'
                    className={cn('flex items-center', variant === 'destructive' && 'dark:text-primary-destructive')}
                >
                    {text}
                </Typography>
                {!!description && <Typography variant='secondary' size='xs' weight='medium' className='ml-auto'>{description}</Typography>}
                {children && displayChildrenFrom === 'right' && children}
            </li>
        </Item>
    );
};
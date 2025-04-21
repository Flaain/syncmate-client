import { cn } from '../lib/utils/cn';

import { ContextMenuItem } from './context-menu';
import { DropdownMenuItem } from './dropdown-menu';
import { Typography } from './Typography';

interface MenuItemProps {
    type: 'ctx' | 'ddm';
    variant?: 'default' | 'destructive';
    text: string;
    icon?: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}

export const MenuItem = ({ type, className, variant = 'default', onClick, text, icon }: MenuItemProps) => {
    const Item = type === 'ctx' ? ContextMenuItem : DropdownMenuItem;

    return (
        <Item
            asChild
            className={cn(
                'active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md hover:bg-primary-gray focus:bg-primary-gray',
                variant === 'destructive'
                    ? 'dark:hover:bg-primary-destructive/10 dark:focus:bg-primary-destructive/10'
                    : 'dark:hover:bg-light-secondary-color dark:focus:bg-light-secondary-color',
                className
            )}
            onClick={onClick}
        >
            <li>
                {icon}
                <Typography
                    size='sm'
                    weight='medium'
                    className={cn(variant === 'destructive' && 'dark:text-primary-destructive')}
                >
                    {text}
                </Typography>
            </li>
        </Item>
    );
};
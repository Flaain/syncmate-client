import { AtSign, Info, Link, LucideIcon, Mail, Phone } from 'lucide-react';
import { toast } from '../lib/toast';
import { OutletDetailsButtonProps, OutletDetailsTypes } from '../model/types';
import { Typography } from './Typography';
import { Button } from './button';

const toastTitle: Record<OutletDetailsTypes, string> = {
    email: 'Email copied to clipboard',
    phone: 'Phone copied to clipboard',
    link: 'Link copied to clipboard',
    bio: 'Bio copied to clipboard',
    login: 'Login copied to clipboard'
};

const iconMap: Record<OutletDetailsTypes, LucideIcon> = {
    email: Mail,
    link: Link,
    phone: Phone,
    bio: Info,
    login: AtSign
}

export const OutletDetailsButton = ({ data, type }: OutletDetailsButtonProps) => {
    const Icon = iconMap[type];

    const onCopyToClipboard = () => {
        navigator.clipboard.writeText(data);
        toast.success(toastTitle[type]);
    };

    return (
        <Button
            onClick={onCopyToClipboard}
            variant='text'
            size='icon'
            className='text-md whitespace-normal mx-5 text-left box-border relative flex flex-col items-start pl-16 pr-2 py-2 rounded-lg transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-50 hover:bg-primary-dark-50 hover:opacity-100'
        >
            <Icon className='absolute left-4 top-1/2 -translate-y-1/2' />
            {data}
            <Typography variant='secondary'>{type}</Typography>
        </Button>
    );
};
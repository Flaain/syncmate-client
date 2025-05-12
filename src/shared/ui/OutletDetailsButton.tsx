import EmailIcon from '@/shared/lib/assets/icons/email.svg?react';
import InfoIcon from '@/shared/lib/assets/icons/info.svg?react';
import LinkIcon from '@/shared/lib/assets/icons/link.svg?react';
import MentionIcon from '@/shared/lib/assets/icons/mention.svg?react';

import { toast } from '../lib/toast';
import { OutletDetailsButtonProps, OutletDetailsButtonType } from '../model/types';

import { Button } from './button';
import { Typography } from './Typography';

const iconMap: Record<OutletDetailsButtonType, React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string; desc?: string; descId?: string }>> = {
    email: EmailIcon,
    link: LinkIcon,
    bio: InfoIcon,
    login: MentionIcon
}

export const OutletDetailsButton = ({ data, type }: OutletDetailsButtonProps) => {
    const Icon = iconMap[type];

    const onCopyToClipboard = () => {
        navigator.clipboard.writeText(data);
        toast.success(`${type} copied to clipboard`);
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
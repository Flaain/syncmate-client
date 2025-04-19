import { ArrowLeft } from 'lucide-react';

import { Typography } from './Typography';
import { Button } from './button';

interface SidebarHeaderProps {
    title: string;
    onBack: () => void;
    children?: React.ReactNode;
}

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
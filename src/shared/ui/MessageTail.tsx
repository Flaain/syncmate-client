import MessageTailSVG from '@/shared/lib/assets/message-tail.svg?react';

import { cn } from '../lib/utils/cn';

interface MessageTailProps extends React.SVGProps<SVGSVGElement> {
    position: 'left' | 'right';
}

export const MessageTail = ({ position, className }: MessageTailProps) => {
    return (
        <MessageTailSVG
            className={cn(
                'absolute z-10 bottom-0 w-[11px] h-5',
                position === 'left' ? '-left-[10px]' : '-right-[10px] -scale-x-100',
                className
            )}
        />
    );
};
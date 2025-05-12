import { Typography } from '@/shared/ui/Typography';

import { SessionProps } from '../model/types';

export const Session = ({ session, isCurrent }: SessionProps) => {
    const { userAgent } = session;

    const createdAt = new Date(session.createdAt);

    return (
        <div className='flex items-start gap-5 flex-1'>
            <div className='flex items-center flex-1'>
                <div className='flex flex-col items-start'>
                    <Typography as='h3'>
                        {userAgent?.browser.name ?? 'Unknown browser'}&nbsp;{userAgent?.browser?.major}
                    </Typography>
                    <Typography as='h3' size='sm'>
                        {userAgent?.os.name ?? 'Unknown OS'}
                    </Typography>
                </div>
                {!isCurrent && (
                    <Typography
                        as='p'
                        title={`Created at ${createdAt.toLocaleString()}`}
                        variant='secondary'
                        className='ml-auto line-clamp-1'
                        size='sm'
                    >
                        {new Intl.DateTimeFormat('en-EN', { day: '2-digit', month: 'short' }).format(createdAt)}
                    </Typography>
                )}
            </div>
        </div>
    );
};
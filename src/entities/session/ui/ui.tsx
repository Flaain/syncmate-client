import { Typography } from '@/shared/ui/Typography';

import { SessionProps } from '../model/types';

export const Session = ({ session, isCurrent }: SessionProps) => {
    const { userAgent } = session;

    const createdAt = new Date(session.createdAt);

    return (
        <>
            <Typography className='text-left'>
                {userAgent?.browser.name ?? 'Unknown browser'}&nbsp;{userAgent?.browser?.major}
                <br />
                {userAgent?.os.name ?? 'Unknown OS'}
            </Typography>
            {!isCurrent && (
                <Typography
                    title={`Created at ${createdAt.toLocaleString()}`}
                    variant='secondary'
                    className='ml-auto line-clamp-1'
                    size='sm'
                >
                    {new Intl.DateTimeFormat('en-EN', { day: '2-digit', month: 'short' }).format(createdAt)}
                </Typography>
            )}
        </>
    );
};
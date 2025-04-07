import { Typography } from './Typography';

export const AuthFormContainer = ({
    title,
    children,
    description
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) => (
    <div className='grid md:grid-cols-[minmax(200px,450px)_minmax(500px,_1fr)] max-md:grid-cols-1 size-full max-w-[1230px] gap-5'>
        <div className='my-auto ml-auto max-md:hidden'>
            <Typography variant='primary' as='h1' size='6xl' weight='bold' align='right' className='max-lg:text-5xl mb-2 '>
                {title}
            </Typography>
            <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-xl'>
                {description}
            </Typography>
        </div>
        {children}
    </div>
);
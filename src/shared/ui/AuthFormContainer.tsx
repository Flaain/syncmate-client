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
    <div className='grid md:grid-cols-[40%_1fr] max-md:grid-cols-1 size-full max-w-[1230px]'>
        <div className='my-auto max-md:hidden md:pr-5 box-border'>
            <Typography
                variant='primary'
                as='h1'
                size='6xl'
                weight='bold'
                align='right'
                className='max-lg:text-5xl mb-2 '
            >
                {title}
            </Typography>
            <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-base'>
                {description}
            </Typography>
        </div>
        <div className='flex max-md:justify-center w-full box-border md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
            {children}
        </div>
    </div>
);
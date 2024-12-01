import { Typography } from '@/shared/ui/Typography';

export const Placeholder = ({ text }: { text: string }) => (
    <div className='w-full min-h-[70px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'>
        <Typography variant='secondary' className='m-auto text-center'>
            {text}
        </Typography>
    </div>
);
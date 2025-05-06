import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

export const ScreenLoader = () => (
    <div className='flex items-center justify-center h-dvh w-full dark:text-primary-white text-primary-dark-100 dark:bg-primary-dark-200 bg-white'>
        <LoaderIcon className='size-10 animate-loading' />
    </div>
);
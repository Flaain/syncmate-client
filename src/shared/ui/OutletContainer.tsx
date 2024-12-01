import React from 'react';

export const OutletContainer = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => {
    return (
        <section
            ref={ref}
            className='flex flex-col w-full overflow-auto dark:bg-primary-dark-200 bg-primary-white z-10 h-svh'
        >
            {children}
        </section>
    );
});
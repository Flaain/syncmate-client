import * as React from 'react';

import { OTPInput, OTPInputContext } from 'input-otp';

import GeometricDotIcon from '@/shared/lib/assets/icons/geometric_dot.svg?react';

import { cn } from '@/shared/lib/utils/cn';

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
    ({ className, containerClassName, ...props }, ref) => (
        <OTPInput
            ref={ref}
            containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
            className={cn('disabled:cursor-not-allowed', className)}
            {...props}
        />
    )
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center', className)} {...props} />
);
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
    React.ElementRef<'div'>,
    React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
        <div
            ref={ref}
            className={cn(
                'relative flex size-12 items-center justify-center border-y border-r dark:text-primary-white text-primary-dark-50 border-slate-200 text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md dark:border-primary-dark-50',
                isActive && 'z-10 ring-2 ring-offset-white dark:ring-primary-dark-50',
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                    <div className='h-4 w-px animate-caret-blink bg-primary-dark-100 duration-1000 dark:bg-primary-white' />
                </div>
            )}
        </div>
    );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(
    ({ ...props }, ref) => (
        <div ref={ref} role='separator' {...props}>
            <GeometricDotIcon />
        </div>
    )
);
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
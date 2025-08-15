import React from 'react';

import { REGEXP_ONLY_DIGITS } from 'input-otp';

import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { cn } from '../lib/utils/cn';
import { getOtpRetryTime } from '../lib/utils/getOtpRetryTime';
import { useOtp } from '../model/store';
import { OtpProps } from '../model/types';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Typography } from '../ui/Typography';

export const OTP = React.forwardRef<HTMLInputElement, OtpProps>(
    (
        { onComplete, onResend, onChange, withResend = true, disabled, containerClassName, ...rest },
        ref
    ) => {
        const [isResending, setIsResending] = React.useState(false);

        const otp = useOtp();

        const timerRef = React.useRef<ReturnType<typeof setInterval>>(null!);

        const handleResend = async () => {
            setIsResending(true);
            await onResend?.();
            setIsResending(false);
        };

        React.useEffect(() => {
            if (!otp?.retryDelay) return;

            timerRef.current = setInterval(() => {
                useOtp.setState((prevState) => ({ retryDelay: prevState.retryDelay - 1000 }));
            }, 1000);

            return () => clearInterval(timerRef.current);
        }, [!!otp?.retryDelay]);

        React.useEffect(() => {
            if (otp?.retryDelay <= 0) {
                clearInterval(timerRef.current);
                useOtp.setState({ retryDelay: 0 });
            }
        }, [otp?.retryDelay]);

        return (
            <div className={cn('flex flex-col gap-2', containerClassName)}>
                <InputOTP
                    {...rest}
                    onChange={onChange}
                    ref={ref}
                    render={undefined}
                    autoFocus
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    onComplete={onComplete}
                    containerClassName='max-w-fit'
                    disabled={disabled || isResending}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} className='size-12' />
                        <InputOTPSlot index={1} className='size-12' />
                        <InputOTPSlot index={2} className='size-12' />
                        <InputOTPSlot index={3} className='size-12' />
                        <InputOTPSlot index={4} className='size-12' />
                        <InputOTPSlot index={5} className='size-12' />
                    </InputOTPGroup>
                </InputOTP>
                <div className='flex gap-1 flex-col'>
                    {withResend &&
                        (!!otp?.retryDelay ? (
                            <Typography size='sm' variant='secondary'>
                                Resend your email if it doesn’t arrive in {getOtpRetryTime(otp?.retryDelay)}
                            </Typography>
                        ) : (
                            <Button
                                type='button'
                                disabled={isResending}
                                size='text'
                                variant='link'
                                className='self-start dark:text-primary-white text-primary-dark-100'
                                onClick={handleResend}
                            >
                                {isResending ? (
                                    <>
                                        <LoaderIcon className='size-4 animate-loading' />
                                        &nbsp;Resend email
                                    </>
                                ) : (
                                    'Resend email'
                                )}
                            </Button>
                        ))}
                </div>
            </div>
        );
    }
);
import React from 'react';

import { REGEXP_ONLY_DIGITS } from 'input-otp';

import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { getOtpRetryTime } from '../lib/utils/getOtpRetryTime';
import { useOtp } from '../model/store';
import { OtpProps } from '../model/types';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Typography } from '../ui/Typography';

export const OTP = React.forwardRef<HTMLInputElement, OtpProps>(({ onComplete, onResendCB, disabled, ...rest }, ref) => {
    const { isResending, otp, onResend } = useOtp();

    const timerRef = React.useRef<ReturnType<typeof setInterval>>(null!);

    const handleResend = () => {
        onResendCB?.();
        onResend();
    }

    React.useEffect(() => {
        if (!otp?.retryDelay) return;

        timerRef.current = setInterval(() => {
            useOtp.setState((prevState) => ({ otp: { ...otp, retryDelay: prevState.otp.retryDelay - 1000 } }));
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [!!otp?.retryDelay]);

    React.useEffect(() => {
        if (otp?.retryDelay <= 0) {
            clearInterval(timerRef.current);
            useOtp.setState({ otp: { ...otp, retryDelay: 0 } });
        }
    }, [otp?.retryDelay]);

    return (
        <div className='flex flex-col gap-2'>
            <InputOTP
                {...rest}
                ref={ref}
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
            {!!otp.retryDelay ? (
                <Typography size='sm' variant='secondary'>
                    Resend your email if it doesn’t arrive in {getOtpRetryTime(otp.retryDelay)}
                </Typography>
            ) : (
                <Button
                    type='button'
                    disabled={isResending}
                    size='text'
                    variant='link'
                    className='self-start'
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
            )}
        </div>
    );
});
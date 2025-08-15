import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { OTP } from '@/shared/ui/OTP';
import { Typography } from '@/shared/ui/Typography';

import { steps } from '../model/constants';
import { useSignup } from '../model/useSignup';
import { getStageDescription } from '../utils/getStageDescription';

import { Credentials } from './Credentials';
import { Profile } from './Profile';

export const SignupForm = () => {
    const { form, step, loading, isLastStep, isNextButtonDisabled, onSubmit, onBack, onOtpResend, onFormChange } = useSignup();

    const rootMessage = form.formState.errors.root?.server?.message;

    const components = {
        0: <Credentials />,
        1: <Profile />,
        2: (
            <FormField
                name='otp'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>Enter verification code</FormLabel>
                        <FormControl>
                            <OTP {...field} onResend={onOtpResend} onComplete={onSubmit} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.root?.otp?.message}</FormMessage>
                    </FormItem>
                )}
            />
        )
    };

    return (
        <AuthFormContainer {...getStageDescription(isLastStep, form.getValues('email'))}>
            <Form {...form}>
                <form
                    onChange={onFormChange}
                    onSubmit={onSubmit}
                    className='flex flex-col gap-4 h-full justify-center max-w-[560px] w-full'
                >
                    <Typography variant='primary' weight='medium' className='mb-5'>
                        Step {step + 1} of {steps.length}
                    </Typography>
                    {components[step as keyof typeof components]}
                    <div className='flex flex-col'>
                        {rootMessage && (
                            <Typography variant='error' className='text-sm max-md:text-xs'>
                                {rootMessage}
                            </Typography>
                        )}
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button type='button' intent='secondary' onClick={onBack} disabled={loading}>
                                Back
                            </Button>
                            {!isLastStep && (
                                <Button intent='primary' type='submit' size='md' disabled={isNextButtonDisabled}>
                                    {loading ? <LoaderIcon className='size-5 animate-loading' /> : 'Next'}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </AuthFormContainer>
    );
};
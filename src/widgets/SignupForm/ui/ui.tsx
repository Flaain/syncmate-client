import { Typography } from '@/shared/ui/Typography';
import { SignupProfile } from '@/widgets/SignupForm/ui/SignupProfile';
import { OTP } from '@/features/OTP/ui/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { LoaderCircle } from 'lucide-react';
import { SignupCredentials } from './SignupCredentials';
import { steps } from '../model/constants';
import { useSignup } from '../lib/useSignup';
import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';

const components = {
    0: <SignupCredentials />,
    1: <SignupProfile />
};

export const SignupForm = () => {
    const { form, step, loading, isLastStep, onSubmit, onBack, isNextButtonDisabled } = useSignup();

    return (
        <AuthFormContainer
            title={isLastStep ? 'Verify your email' : 'Sign up'}
            description={
                isLastStep
                    ? `We’ve sent an email to ${form.getValues('email').toLowerCase()} with a OTP code to verify your email`
                    : "We're so excited to have you join us!"
            }
        >
            <Form {...form}>
                <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                    <form
                        onSubmit={onSubmit}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                    >
                        <Typography variant='primary' weight='medium' className='mb-5'>
                            Step {step + 1} of {steps.length}
                        </Typography>
                        {isLastStep ? (
                            <FormField
                                name='otp'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='relative'>
                                        <FormLabel className='text-white'>Enter verification code</FormLabel>
                                        <FormControl>
                                            <OTP {...field} onComplete={onSubmit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            components[step as keyof typeof components]
                        )}
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button
                                type='button'
                                variant='secondary'
                                className='w-24'
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            {!isLastStep && (
                                <Button className='w-24' disabled={isNextButtonDisabled}>
                                    {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : 'Submit'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </Form>
        </AuthFormContainer>
    );
};
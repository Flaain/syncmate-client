import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';
import { Button } from '@/shared/ui/button';
import { Form, FormOTP } from '@/shared/ui/form';
import { Typography } from '@/shared/ui/Typography';

import { steps } from '../model/constants';
import { useSignup } from '../model/useSignup';

import { Credentials } from './Credentials';
import { Profile } from './Profile';

const components = {
    0: <Credentials />,
    1: <Profile />
};

export const SignupForm = () => {
    const { form, step, loading, isLastStep, onSubmit, onBack, isNextButtonDisabled } = useSignup();

    return (
        <AuthFormContainer
            title={isLastStep ? 'Verify your email' : 'Sign up'}
            description={isLastStep ? `We’ve sent an email to ${form.getValues('email').toLowerCase()} with a OTP code to verify your email` : "We're so excited to have you join us!"}
        >
            <Form {...form}>
                <div className='flex max-md:justify-center flex-1 box-border md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                    <form
                        onChange={() => form.clearErrors('root')}
                        onSubmit={onSubmit}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                    >
                        <Typography variant='primary' weight='medium' className='mb-5'>
                            Step {step + 1} of {steps.length}
                        </Typography>
                        {isLastStep ? <FormOTP onSubmit={onSubmit} /> : components[step as keyof typeof components]}
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button
                                type='button'
                                intent='secondary'
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            {!isLastStep && (
                                <Button intent='primary' size='md' disabled={isNextButtonDisabled}>
                                    {loading ? <LoaderIcon className='size-5 animate-loading' /> : 'Next'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </Form>
        </AuthFormContainer>
    );
};
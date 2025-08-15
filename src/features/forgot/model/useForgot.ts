import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldPath, useForm } from 'react-hook-form';

import { ApiException, otpApi } from '@/shared/api';
import { useSigninForm } from '@/shared/lib/providers/signin';
import { useOtp } from '@/shared/model/store';

import { forgotAPI } from '../api';
import { forgotSchema, ForgotSchemaType } from '../model/schema';

const steps: Array<{ fields: Array<FieldPath<ForgotSchemaType>> }> = [
    { fields: ['email'] },
    { fields: ['otp'] },
    { fields: ['password', 'confirmPassword'] }
];

export const useForgot = () => {
    const [step, setStep] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const form = useForm<ForgotSchemaType>({
        resolver: zodResolver(forgotSchema),
        defaultValues: {
            email: '',
            otp: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'all',
        shouldFocusError: true
    });
    
    const isNextButtonDisabled = (
        !form.getValues(steps[step].fields).every(Boolean) ||
        !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<ForgotSchemaType>)) || isLoading
        );
        
    const changeAuthStage = useSigninForm((state) => state.changeSigninStage);

    const createPasswordResetOtp = async ({ email }: Omit<ForgotSchemaType, 'confirmPassword'>) => {
        const { data: { retryDelay } } = await otpApi.create({ email, type: 'password_reset' });

        useOtp.setState({ target: email, type: 'password_reset', retryDelay });
        
        setStep((prevState) => prevState + 1);
    };

    const resetPassword = async ({ email, password, otp }: Omit<ForgotSchemaType, 'confirmPassword'>) => {
        await forgotAPI.reset({ email, password, otp });

        // toast.success('Password changed successfully');
        
        changeAuthStage('signin');
    };

    const verifyPasswordResetOtp = async ({ email, otp }: Omit<ForgotSchemaType, 'confirmPassword'>) => {
        await otpApi.verify({ otp, email, type: 'password_reset' });

        setStep((prevState) => prevState + 1);
    };

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();

            setIsLoading(true);

            const isValid = await form.trigger(steps[step].fields);

            if (!isValid) return;
            
            const { otp, email, password } = form.getValues();

            const actions: Record<number, (data: Omit<ForgotSchemaType, 'confirmPassword'>) => Promise<void>> = {
                0: createPasswordResetOtp,
                1: verifyPasswordResetOtp,
                2: resetPassword
            };

            await actions[step]({ email, otp, password });
        } catch (error) {
            console.error(error);
            if (error instanceof ApiException) {
                error.response.data.errors?.forEach(({ path, message }) => {
                    steps[step].fields.includes(path as FieldPath<ForgotSchemaType>) && form.setError(path as FieldPath<ForgotSchemaType>, { message }, { shouldFocus: true });  
                })
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onBack = () => {
        !step ? changeAuthStage('signin') : setStep((prevState) => prevState - 1)
    };

    return { form, step, isLoading, onSubmit, onBack, isNextButtonDisabled };
};
import { otpApi } from '@/features/OTP';
import { useOtp } from '@/features/OTP/model/store';
import { OtpType } from '@/features/OTP/model/types';
import { ApiException } from '@/shared/api/error';
import { toast } from '@/shared/lib/toast';
import { useSigninForm } from '@/widgets/SigninForm/model/store';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { forgotAPI } from '../api';
import { steps } from '../model/constants';
import { forgotSchema } from '../model/schema';
import { ForgotSchemaType } from '../model/types';

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

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();

            setIsLoading(true);

            const isValid = await form.trigger(steps[step].fields);

            if (!isValid) return;
            
            const { otp, email, password } = form.getValues();

            const actions = {
                0: async () => {
                    const { data: { retryDelay } } = await otpApi.create({ email, type: OtpType.PASSWORD_RESET })

                    useOtp.setState({ otp: { targetEmail: email, type: OtpType.PASSWORD_RESET, retryDelay } });
                    
                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    await otpApi.verify({ otp, email, type: OtpType.PASSWORD_RESET });

                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    await forgotAPI.reset({ email, password, otp });

                    toast.success('Password changed successfully');
                    
                    changeAuthStage('signin');
                }
            }

            await actions[step as keyof typeof actions]();
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

    const onBack = React.useCallback(() => {
        !step ? changeAuthStage('signin') : setStep((prevState) => prevState - 1)
    }, [step]);

    return { form, step, isLoading, onSubmit, onBack, isNextButtonDisabled };
};
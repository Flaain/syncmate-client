import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";
import { otpApi } from "@/features/OTP";
import { useOtp } from "@/features/OTP/model/store";
import { OtpType } from "@/features/OTP/model/types";
import { useAuth } from "@/pages/Auth";
import { ApiException } from "@/shared/api/error";
import { UserCheckType } from "@/shared/model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { signupApi } from "../api";
import { steps } from "../model/constants";
import { signupSchema } from "../model/schema";
import { SignupSchemaType } from "../model/types";

export const useSignup = () => {
    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    
    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            login: '',
            birthDate: '',
            otp: ''
        },
        disabled: false,
        mode: 'all',
        shouldFocusError: true
    })
    
    const isNextButtonDisabled =
    !form.getValues(steps[step].fields).every(Boolean) ||
    !!Object.entries(form.formState.errors).some(([key]) => steps[step].fields.includes(key as FieldPath<SignupSchemaType>)) ||
    loading;
    
    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step].fields[0]);
    }, [step])
    
    const changeAuthStage = useAuth((state) => state.changeAuthStage);

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            const data = form.getValues();
            
            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });
            
            if (!isValid) return;

            setLoading(true);

            const actions = {
                0: async () => {
                    await signupApi.check({ type: UserCheckType.EMAIL, email: data.email.toLowerCase().trim() });

                    setStep((prevState) => prevState + 1);
                },
                1: async () => {
                    await signupApi.check({ type: UserCheckType.LOGIN, login: data.login.toLowerCase().trim() });
                    
                    const { data: { retryDelay } } = await otpApi.create({ email: data.email, type: OtpType.EMAIL_VERIFICATION });
                    
                    useOtp.setState({ otp: { targetEmail: data.email, type: OtpType.EMAIL_VERIFICATION, retryDelay } });
                    
                    setStep((prevState) => prevState + 1);
                },
                2: async () => {
                    const { confirmPassword, ...rest } = data;
                    
                    const { data: profile } = await signupApi.signup(rest);

                    useProfile.setState({ profile });
                    useSession.getState().actions.onSignin(profile._id);
                }
            };

            await actions[step as keyof typeof actions]();
        } catch (error) {
            console.error(error);
            if (error instanceof ApiException) {
                error.response.data.errors?.forEach(({ path, message }) => {
                   steps[step].fields.includes(path as FieldPath<SignupSchemaType>) && form.setError(path as FieldPath<SignupSchemaType>, { message }); 
                });
        
                // !error.response.data.errors && error.toastError();
            } else {
                // toast.error('Something went wrong. Please try again later', { position: 'top-center' });
            }
        } finally {
            setLoading(false);
        }
    };

    const onBack = () => {
        if (!step) return changeAuthStage('welcome');

        form.resetField('otp');

        setStep((prevState) => prevState - 1);
    }

    return {
        loading,
        isLastStep: step === steps.length - 1,
        step,
        form,
        isNextButtonDisabled,
        changeAuthStage,
        onSubmit,
        onBack
    }
}
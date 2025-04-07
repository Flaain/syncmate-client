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
    
    const isNextButtonDisabled = !form.getValues(steps[step].fields).every(Boolean) || !!Object.keys(form.formState.errors).some((key) => key === 'root' ? Object.keys(form.formState.errors.root!).some((root_key) => root_key === 'server' || steps[step].fields.includes(root_key as FieldPath<SignupSchemaType>)) : steps[step].fields.includes(key as FieldPath<SignupSchemaType>)) || loading;

    const checkEmail = React.useCallback(async ({ email }: SignupSchemaType) => {
        await signupApi.check({ type: UserCheckType.EMAIL, email: email.toLowerCase().trim() });

        setStep((prevState) => prevState + 1);
    }, []);

    const checkLogin = React.useCallback(async ({ login, email }: SignupSchemaType) => {
        const trimmedEmail = email.toLowerCase().trim();

        await signupApi.check({ type: UserCheckType.LOGIN, login: login.toLowerCase().trim() });
                    
        const { data: { retryDelay } } = await otpApi.create({ email: trimmedEmail, type: OtpType.EMAIL_VERIFICATION });
        
        useOtp.setState({ otp: { targetEmail: trimmedEmail, type: OtpType.EMAIL_VERIFICATION, retryDelay } });
        
        setStep((prevState) => prevState + 1);
    }, []);

    const signUp = React.useCallback(async ({ confirmPassword, ...rest }: SignupSchemaType) => {
        const { data } = await signupApi.signup(rest);

        useProfile.setState({ profile: data });
        useSession.getState().actions.onSignin(data._id);
    }, []);

    const changeAuthStage = useAuth((state) => state.changeAuthStage);

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault?.();
            
            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });
            
            if (!isValid) return;

            const data = form.getValues();
            
            setLoading(true);

            await formActions.current[step](data);
        } catch (error) {
            console.error(error);
            if (error instanceof ApiException && error.response.data.errors) {
                error.response.data.errors.forEach(({ path, message }, i) => {
                   steps[step].fields.includes(path as FieldPath<SignupSchemaType>) && form.setError(`root.${path}`, { message });

                   !i && setTimeout(form.setFocus, 0, path);
                });
            } else {
                form.setError('root.server', { message: 'Cannot process signup. Please try again' }, { shouldFocus: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const formActions = React.useRef<Record<number, (data: SignupSchemaType) => Promise<void>>>({
        0: checkEmail,
        1: checkLogin,
        2: signUp
    });

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
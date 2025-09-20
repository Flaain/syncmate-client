import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";

import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";

import { ApiException, otpApi } from "@/shared/api";
import { useAuth } from "@/shared/lib/providers/auth";
import { useOtp } from "@/shared/model/store";

import { signinApi } from "../api";
import { signinSchema, SigninSchemaType } from "../model/schema";

import { SigninWithTFA } from "./type";

const steps: Array<{ fields: Array<FieldPath<SigninSchemaType>> }> = [
    { fields: ['login', 'password'] },
    { fields: ['otp'] }
]

export const useSignin = () => {
    const [loading, setLoading] = React.useState(false);
    const [step, setStep] = React.useState(0);

    const onSignin = useSession((state) => state.actions.onSignin);
    const changeAuthStage = useAuth((state) => state.changeAuthStage);
    
    const setGlobalError = (message?: string) => form.setError(
        'root.server',
        { message: message || 'Cannot process signin. Please try again' },
        { shouldFocus: true }
    );

    const tfaInfo = React.useRef<SigninWithTFA>(null);
    
    const form = useForm<SigninSchemaType>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            login: "",
            password: "",
            otp: ""
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const isSubmitButtonDisabled = loading || !form.getValues(steps[step].fields).every(Boolean) || !!Object.keys(form.formState.errors).some((key) => key === 'root' ? Object.keys(form.formState.errors.root!).some((root_key) => steps[step].fields.includes(root_key as FieldPath<SigninSchemaType>)) : steps[step].fields.includes(key as FieldPath<SigninSchemaType>));

    const onFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        form.clearErrors('root.server');

        if (event.target instanceof HTMLElement && form.formState.errors.root?.[event.target.name]) {
            const fieldName = event.target.name;
            
            steps[step].fields.includes(fieldName as FieldPath<SigninSchemaType>) && form.clearErrors(`root.${fieldName}`)
        }
    }
        
    const onOtpResend = async () => {
        try {
            form.clearErrors('root.otp');
            form.setValue('otp', '');
            
            setLoading(true);

            const { data: { retryDelay } } = await otpApi.create({ email: form.getValues().login.trim(), type: 'tfa_signin' });

            useOtp.setState({ retryDelay });
        } catch (error) {
            console.error(error);
            form.setError('root.otp', { message: 'Cannot resend otp code. Please try again' }, { shouldFocus: true });
        } finally {
            setLoading(false);
        }
    };

    const onBack = () => {
        form.clearErrors('root');

        if (step === 1) {
            setStep(0);

            form.setValue('otp', '');
        } else {
            changeAuthStage('welcome');
        }
    }

    const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
        try {
            event?.preventDefault();

            setLoading(true);

            const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

            if (!isValid) return;

            const response = await signinApi.signin(form.getValues());

            if ('tfaRequired' in response.data) {
                setStep(1);

                tfaInfo.current = response.data;

                if (/* TFA_TYPE[response.data.type] === 'EMAIL' */ response.data.type === 1) {
                    useOtp.setState({
                        type: 'tfa_signin',
                        retryDelay: response.data.retryDelay,
                        target: form.getValues().login.trim()
                    });
                }
            } else {
                useProfile.setState({ profile: response.data });
                onSignin(response.data._id);
            }
        } catch (error) {
            console.error(error);

            if (error instanceof ApiException) {
                if (error.response.data.errors) {
                    const fields = steps[step].fields;

                    let atleastOneErrorWasSet = false;

                    error.response.data.errors.forEach(({ path, message }, i) => {
                        if (fields.includes(path as FieldPath<SigninSchemaType>)) {
                            form.setError(`root.${path}`, { message });

                            atleastOneErrorWasSet = true;

                            !i && requestAnimationFrame(() => form.setFocus(path as FieldPath<SigninSchemaType>));
                        }
                    });

                    !atleastOneErrorWasSet && setGlobalError(error.response.data.message);
                } else {
                    setGlobalError(error.response.data.message);
                }
            } else {
                setGlobalError();
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        step,
        tfaInfo,
        onSubmit,
        onOtpResend,
        onBack,
        onFormChange,
        isSubmitButtonDisabled
    };
};
import React from "react";

import { useShallow } from "zustand/shallow";

import { useProfile } from "@/entities/profile";

import { BIO_MAX_LENGTH, NAME_MAX_LENGTH } from "@/shared/constants";

const fieldRules: Record<string, { required: boolean; maxLength: number }> = {
    name: { required: true, maxLength: NAME_MAX_LENGTH },
    lastName: { required: false, maxLength: NAME_MAX_LENGTH },
    bio: { required: false, maxLength: BIO_MAX_LENGTH }
};

type EditProfilePaths = 'name' | 'lastName' | 'bio';

// Because form is not that hard and big decided to not useForm

export const useProfileMenu = () => {
    const profile = useProfile(useShallow((state) => state.profile));
    
    const [formState, setFormState] = React.useState<Record<EditProfilePaths, { value: string, hasError?: boolean }>>({ 
        name: { value: profile.name },
        lastName: { value: '' },
        bio: { value: '' }
    });

    const canSubmit = React.useMemo(() => {
        const state = Object.entries(formState);

        return state.every(([_, { hasError }]) => !hasError) && state.some(([key, { value }]) => value.trim() !== (profile[key as keyof typeof profile] ?? ''));
    }, [formState, profile]);

    const onChange = ({ currentTarget: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value.trim().length && !formState[name as keyof typeof formState].value.length) return;

        const rules = fieldRules[name];
        
        setFormState((prevState) => ({
            ...prevState,
            [name]: {
                value,
                hasError: (rules.required && !value.length) || value.length > rules.maxLength
            }
        }));
    }

    const handleSubmit = () => {
        if (!canSubmit) return;

        // const obj = Object.entries(formState).reduce((acc, [name, field]) => ({ ...acc, [name]: { ...field, value: field.value.trim() } }), {});

        console.log(formState);
    }

    return { onChange, handleSubmit, formState, canSubmit };
};

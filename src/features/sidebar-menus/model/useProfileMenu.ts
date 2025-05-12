import React from "react";

import { useShallow } from "zustand/shallow";

import { EditProfile, EditProfilePaths, profileApi, useProfile } from "@/entities/profile";

import { BIO_MAX_LENGTH, NAME_MAX_LENGTH } from "@/shared/constants";
import { useQuery } from "@/shared/lib/hooks/useQuery";
import { toast } from "@/shared/lib/toast";

const fieldRules: Record<string, { required: boolean; maxLength: number }> = {
    name: { required: true, maxLength: NAME_MAX_LENGTH },
    lastName: { required: false, maxLength: NAME_MAX_LENGTH },
    bio: { required: false, maxLength: BIO_MAX_LENGTH }
};

// Because form is not that hard and big decided to not useForm

export const useProfileMenu = () => {
    const profile = useProfile(useShallow((state) => state.profile));
    
    const [formState, setFormState] = React.useState<Record<EditProfilePaths, { value: string, hasError?: boolean }>>({ 
        name: { value: profile.name },
        lastName: { value: profile.lastName ?? '' },
        bio: { value: profile.bio ?? '' }
    });

    const { isLoading, call } = useQuery(({ signal }) => profileApi.edit(Object.entries(formState).reduce((acc, [name, field]) => ({ ...acc, [name]: field.value.trim() }), {} as EditProfile), signal), {
        onSuccess: (data) => useProfile.setState((prevState) => ({ profile: { ...prevState.profile, ...data } })),
        onError: () => toast.error('Failed to edit profile. Please try again'),
        enabled: false
    });

    const canSubmit = React.useMemo(() => {
        const state = Object.entries(formState);

        return state.every(([_, { hasError }]) => !hasError) && state.some(([key, { value }]) => value.trim() !== (profile[key as keyof typeof profile] ?? ''));
    }, [formState, profile]);

    const onChange = ({ currentTarget: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
        const rules = fieldRules[name];
        
        setFormState((prevState) => ({
            ...prevState,
            [name]: {
                value,
                hasError: (rules.required && !value.length) || value.length > rules.maxLength
            }
        }));
    }

    return { onChange, isLoading, call, formState, canSubmit };
};

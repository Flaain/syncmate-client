import React from "react";

interface FieldState {
    value: string | boolean;
    ref?: React.RefObject<HTMLInputElement>;
    hasError?: boolean;
    rules?: { required?: boolean; maxLength?: number };
}

export const useSimpleForm = <T extends Record<string, Omit<FieldState, 'hasError'>>>(defaultValues: T) => {
    const [formState, setFormState] = React.useState<{ [K in keyof T]: T[K] & { hasError?: boolean; ref?: FieldState['ref'] } }>(defaultValues);
    const [canSubmit, setCanSubmit] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const lastSubmittedValues = React.useRef(defaultValues);

    const getCanSubmit = (formState: Record<string, FieldState>) => {
        const state = Object.entries(formState);

        return state.every(([_, { hasError }]) => !hasError) && state.some(([key, { value }]) => value.toString().trim() !== (lastSubmittedValues.current[key as keyof typeof lastSubmittedValues.current]?.value.toString() ?? ''));
        // true.toString() !== false.toString()
    };

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const rules = formState[target.name].rules;
        
        const field = {
            ...formState[target.name],
            value: target.type === 'checkbox' ? target.checked : target.value,
            hasError: rules ? !!validateField({ target, rules }) : false
        };

        setFormState((prevState) => ({ ...prevState, [target.name]: field }));
        setCanSubmit(getCanSubmit({ ...formState, [target.name]: field }));
    };

    const getValues = () => Object.entries(formState).reduce((acc, [name, field]) => ({
        ...acc,
        [name]: typeof field.value === 'boolean' ? field.value : field.value.trim()
    }), {} as { [K in keyof T]: T[K]['value'] });

    const handleSubmit = (onSubmit: (data: { [K in keyof T]: T[K]['value'] }) => void | Promise<void>) => {
        return async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (!canSubmit || isSubmitting) return;

            setIsSubmitting(true);

            await onSubmit(getValues());

            setIsSubmitting(false);
        };
    };

    const validateField = ({ target, rules }: { target: EventTarget & HTMLInputElement, rules: NonNullable<FieldState['rules']> }) => {
        if (target.type === 'checkbox') { // TODO: handle radio too if needed
            return rules.required && !target.checked;
        } else {
            return (
                (rules.required && !target.value.trim().length) ||
                (rules.maxLength && target.value.length > rules.maxLength)
            );
        }
    };

    const onReset = () => {
        lastSubmittedValues.current = defaultValues;
        
        setFormState(defaultValues);
        setCanSubmit(false);
        setIsSubmitting(false);
    };

    const onUpdate = (data: any) => { // TODO: fix type
        for (const key in data) {
            if (lastSubmittedValues.current.hasOwnProperty(key)) { // here we belive if lastSubmittedValues.current[key] exists then formState[key] exists too
                lastSubmittedValues.current[key].value = data[key];
                formState[key].value = data[key];
            };
        }

        setFormState({ ...formState });
        setCanSubmit(false);
        setIsSubmitting(false);
    };

    return {
        getValues,
        onChange,
        onUpdate,
        handleSubmit,
        onReset,
        formState,
        canSubmit,
        isSubmitting
    };
};
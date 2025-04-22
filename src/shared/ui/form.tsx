import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';

import { cn } from '@/shared/lib/utils/cn';

import { Label } from './label';
import { OTP } from './OTP';

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = { name: TName };
type FormItemContextValue = { id: string };

const Form = FormProvider;

const FormFieldContext = React.createContext<FormFieldContextValue>(null!);
const FormItemContext = React.createContext<FormItemContextValue>(null!);

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const { id } = React.useContext(FormItemContext);
    
    if (!fieldContext) throw new Error('useFormField should be used within <FormField>');

    const { getFieldState, formState } = useFormContext();

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...getFieldState(fieldContext.name, formState)
    };
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div ref={ref} className={cn('space-y-2', className)} {...props} />
        </FormItemContext.Provider>
    );
});

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(({ className, ...props }, ref) => {
    const { formItemId } = useFormField();

    return <Label ref={ref} className={className} htmlFor={formItemId} {...props} />;
});

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    );
});

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
            {...props}
        />
    );
});

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message?.trim()) : children;

    if (!body) return null;

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn('text-sm font-medium text-primary-destructive dark:text-primary-destructive', className)}
            {...props}
        >
            {body}
        </p>
    );
});

const FormOTP = ({ onSubmit }: { onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void }) => {
    const form = useFormContext();

    if (!form) throw new Error('FormOTP should be used within <Form>');

    return (
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
    );
};

FormItem.displayName = 'FormItem';
FormLabel.displayName = 'FormLabel';
FormControl.displayName = 'FormControl';
FormDescription.displayName = 'FormDescription';
FormMessage.displayName = 'FormMessage';

export { Form, FormOTP, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField };


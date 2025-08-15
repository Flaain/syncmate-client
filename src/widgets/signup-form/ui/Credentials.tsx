import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/PasswordInput';

import { SignupSchemaType } from '../model/types';

export const Credentials = () => {
    const form = useFormContext<SignupSchemaType>();
    
    const emailErrors = form.formState.dirtyFields.email ? (form.formState.errors.email?.message || form.formState.errors.root?.email?.message) : undefined;
    const passwordErrors = form.formState.dirtyFields.password ? form.formState.errors.password?.message : undefined;
    const confirmPasswordErrros = form.formState.dirtyFields.confirmPassword ? form.formState.errors.confirmPassword?.message : undefined;

    return (
        <>
            <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                {...field}
                                labelClassName='dark:bg-primary-dark-200'
                                label={emailErrors || 'Enter your email address'}
                                variant={emailErrors ? 'destructive' : 'secondary'}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name='password'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <PasswordInput
                                {...field}
                                labelClassName='dark:bg-primary-dark-200'
                                label={passwordErrors || 'Choose your password'}
                                variant={passwordErrors ? 'destructive' : 'secondary'}
                                value={field.value.replace(/\s/g, '')}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name='confirmPassword'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <PasswordInput
                                {...field}
                                labelClassName='dark:bg-primary-dark-200'
                                label={confirmPasswordErrros || 'Confirm your password'}
                                variant={confirmPasswordErrros ? 'destructive' : 'secondary'}
                                value={field.value.replace(/\s/g, '')}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </>
    );
};
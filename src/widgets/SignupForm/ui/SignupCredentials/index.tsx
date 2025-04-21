import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { FormInput } from '@/shared/ui/FormInput';
import { PasswordInput } from '@/shared/ui/PasswordInput';

import { SignupSchemaType } from '../../model/types';

export const SignupCredentials = () => {
    const form = useFormContext<SignupSchemaType>();

    return (
        <>
            <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>Email</FormLabel>
                        <FormControl>
                            <FormInput {...field} autoFocus hasServerError={!!form.formState.errors.root?.email} placeholder='Enter your email address' />
                        </FormControl>
                        <FormMessage>{form.formState.errors.root?.email?.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                name='password'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>Password</FormLabel>
                        <FormControl>
                            <PasswordInput
                                {...field}
                                placeholder='Choose your password'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                value={field.value.replace(/\s/g, '')}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name='confirmPassword'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>Confirm Password</FormLabel>
                        <FormControl>
                            <PasswordInput
                                {...field}
                                placeholder='Confirm your password'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                value={field.value.replace(/\s/g, '')}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
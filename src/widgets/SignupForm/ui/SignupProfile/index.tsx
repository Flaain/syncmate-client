import { FormInput } from '@/shared/ui/FormInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useFormContext } from 'react-hook-form';
import { SignupSchemaType } from '../../model/types';

export const SignupProfile = () => {
    const form = useFormContext<SignupSchemaType>();

    return (
        <>
            <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                    <FormItem className='relative'>
                        <FormLabel className='text-white'>Name</FormLabel>
                        <FormControl>
                            <FormInput {...field} autoFocus placeholder='Enter your name' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name='login'
                control={form.control}
                render={({ field }) => (
                    <FormItem className='relative'>
                        <FormLabel className='text-white'>Login</FormLabel>
                        <FormControl>
                            <FormInput
                                {...field}
                                placeholder='Enter your login'
                                hasServerError={!!form.formState.errors.root?.login}
                            />
                        </FormControl>
                        <FormMessage>{form.formState.errors.root?.login?.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                name='birthDate'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>Your birth date</FormLabel>
                        <FormControl>
                            <FormInput
                                {...field}
                                type='date'
                                placeholder='Enter your birth date'
                                className='block dark:[color-scheme:dark]'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { SignupSchemaType } from '../model/types';

export const Profile = () => {
    const form = useFormContext<SignupSchemaType>();
    
    const nameErrors = form.formState.errors.name?.message;
    const loginErrors = form.formState.errors.login?.message || form.formState.errors.root?.login?.message;
    const birthDateErrors = form.formState.errors.birthDate?.message;

    return (
        <>
            <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                {...field}
                                autoFocus
                                labelClassName='dark:bg-primary-dark-200'
                                label={nameErrors || 'Enter your name'}
                                variant={nameErrors ? 'destructive' : 'secondary'}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name='login'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                {...field}
                                labelClassName='dark:bg-primary-dark-200'
                                label={loginErrors ?? 'Enter your login'}
                                variant={loginErrors ? 'destructive' : 'secondary'}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                name='birthDate'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                {...field}
                                type='date'
                                labelClassName='dark:bg-primary-dark-200'
                                label={birthDateErrors || 'Enter your birth date'}
                                variant={birthDateErrors ? 'destructive' : 'secondary'}
                                className='block dark:[color-scheme:dark]'
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </>
    );
};
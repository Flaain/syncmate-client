import { LoaderCircle } from 'lucide-react';

import { useAuth } from '@/pages/Auth';

import { useSigninForm } from '@/widgets/SigninForm/model/store';

import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { FormInput } from '@/shared/ui/FormInput';

import { useSignin } from '../lib/useSignin';

export const Signin = () => {
    const { form, isSubmitButtonDisabled, onChangeForm, onSubmit, loading } = useSignin();
    
    const changeAuthStage = useAuth((state) => state.changeAuthStage);
    const changeSigninStage = useSigninForm((state) => state.changeSigninStage);

    const serverError = form.formState.errors.root?.server;

    return (
        <Form {...form}>
            <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                <form
                    onChange={onChangeForm}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                >
                    <FormField
                        name='login'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Login</FormLabel>
                                <FormControl>
                                    <FormInput
                                        {...field}
                                        autoFocus
                                        placeholder='Enter your email address or login'
                                        hasServerError={!!serverError}
                                    />
                                </FormControl>
                                <FormMessage />
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
                                    <FormInput
                                        {...field}
                                        type='password'
                                        placeholder='Enter your password'
                                        hasServerError={!!serverError}
                                    />
                                </FormControl>
                                <div className='flex items-center justify-between'>
                                    <FormMessage>{form.formState.errors.root?.server.message}</FormMessage>
                                    <Button
                                        type='button'
                                        variant='link'
                                        onClick={() => changeSigninStage('forgot')}
                                        className='ml-auto p-0 opacity-50 hover:opacity-100 transition-all ease-in-out duration-200'
                                    >
                                        Forgot password?
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className='flex w-full items-center justify-between'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='w-24'
                            onClick={() => changeAuthStage('welcome')}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <Button className='w-24' disabled={isSubmitButtonDisabled}>
                            {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
};
import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { useAuth } from '@/shared/lib/providers/auth';
import { useSigninForm } from '@/shared/lib/providers/signin';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Typography } from '@/shared/ui/Typography';

import { useSignin } from '../model/useSignin';

export const Signin = () => {
    const { form, isSubmitButtonDisabled, onChangeForm, onSubmit, loading } = useSignin();

    const changeAuthStage = useAuth((state) => state.changeAuthStage);
    const changeSigninStage = useSigninForm((state) => state.changeSigninStage);

    const serverError = form.formState.errors.root?.server;
    const loginErrors = form.formState.errors.login?.message;
    const passwordErrors = form.formState.errors.password?.message;
    const rootMessage = form.formState.errors.root?.server.message;
    
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
                                <FormControl>
                                    <Input
                                        {...field}
                                        autoFocus
                                        label={loginErrors ?? 'Email or Login'}
                                        variant={loginErrors || serverError ? 'destructive' : 'secondary'}
                                        labelClassName='dark:bg-primary-dark-200'
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
                                        label={passwordErrors ?? 'Password'}
                                        variant={passwordErrors || serverError ? 'destructive' : 'secondary'}
                                        labelClassName='dark:bg-primary-dark-200'
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center justify-between'>
                        {rootMessage && (
                            <Typography variant='error' className='text-sm max-md:text-xs'>
                                {rootMessage}
                            </Typography>
                        )}
                        <Button
                            type='button'
                            size='text'
                            variant='link'
                            onClick={() => changeSigninStage('forgot')}
                            className='dark:text-primary-white ml-auto'
                        >
                            Forgot password?
                        </Button>
                    </div>
                    <div className='flex w-full items-center justify-between'>
                        <Button
                            type='button'
                            intent='secondary'
                            className='w-24'
                            onClick={() => changeAuthStage('welcome')}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <Button intent='primary' className='w-24' disabled={isSubmitButtonDisabled}>
                            {loading ? <LoaderIcon className='size-5 animate-loading' /> : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
};
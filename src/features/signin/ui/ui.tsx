import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { useSigninForm } from '@/shared/lib/providers/signin';
import { TFA_TYPE } from '@/shared/model/types';
import { AuthFormContainer } from '@/shared/ui/AuthFormContainer';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { OTP } from '@/shared/ui/OTP';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Typography } from '@/shared/ui/Typography';

import { useSignin } from '../model/useSignin';
import { getStageDescription } from '../utils/getStageDescription';

export const Signin = () => {
    const { form, isSubmitButtonDisabled, onFormChange, onSubmit, onBack, onOtpResend, step, tfaInfo, loading } = useSignin();

    const tfaRequired = step === 1;

    const changeSigninStage = useSigninForm((state) => state.changeSigninStage);

    const loginError = form.formState.dirtyFields.login ? form.formState.errors.login?.message : undefined;
    const passwordError = form.formState.dirtyFields.password ? form.formState.errors.password?.message : undefined;
    const rootError = form.formState.errors.root?.server?.message;

    return (
        <AuthFormContainer {...getStageDescription(tfaRequired, tfaInfo.current?.type!)}>
            <Form {...form}>
                <form
                    onChange={onFormChange}
                    onSubmit={onSubmit}
                    className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                >
                    {tfaRequired ? (
                        <FormField
                            name='otp'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>Enter verification code</FormLabel>
                                    <FormControl>
                                        <OTP
                                            {...field}
                                            withResend={TFA_TYPE[tfaInfo.current?.type!] === 'EMAIL'}
                                            onResend={onOtpResend}
                                            onComplete={onSubmit}
                                        />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.root?.otp?.message || rootError}</FormMessage>
                                </FormItem>
                            )}
                        />
                    ) : (
                        <>
                            <FormField
                                name='login'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoFocus
                                                label={loginError ?? 'Email or Login'}
                                                variant={loginError || rootError ? 'destructive' : 'secondary'}
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
                                                label={passwordError ?? 'Password'}
                                                variant={passwordError || rootError ? 'destructive' : 'secondary'}
                                                labelClassName='dark:bg-primary-dark-200'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {!tfaRequired && (
                        <div className='flex items-center justify-between'>
                            {rootError && (
                                <Typography variant='error' className='text-sm max-md:text-xs'>
                                    {rootError}
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
                    )}
                    <div className='flex w-full items-center justify-between'>
                        <Button type='button' intent='secondary' className='w-24' onClick={onBack} disabled={loading}>
                            Back
                        </Button>
                        {!tfaRequired && (
                            <Button intent='primary' className='w-24' disabled={isSubmitButtonDisabled}>
                                {loading ? <LoaderIcon className='size-5 animate-loading' /> : 'Submit'}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </AuthFormContainer>
    );
};
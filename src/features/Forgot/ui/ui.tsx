import { LoaderCircle } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormOTP } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/PasswordInput';

import { useForgot } from '../model/useForgot';

export const Forgot = () => {
    const { form, isNextButtonDisabled, isLoading, onSubmit, onBack, step } = useForgot();

    return (
        <Form {...form}>
            <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                <form
                    onSubmit={onSubmit}
                    className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                >
                    {!step && (
                        <FormField
                            name='email'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            autoFocus
                                            label={form.formState.errors.email?.message ?? 'Email'}
                                            variant={form.formState.errors.email ? 'destructive' : 'secondary'}
                                            labelClassName='dark:bg-primary-dark-200'
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}
                    {step === 1 && <FormOTP onSubmit={onSubmit} />}
                    {step === 2 && (
                        <>
                            <FormField
                                name='password'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                label={form.formState.errors.password?.message ?? 'Password'}
                                                variant={form.formState.errors.password ? 'destructive' : 'secondary'}
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
                                                label={form.formState.errors.password?.message ?? 'Password'}
                                                variant={form.formState.errors.password ? 'destructive' : 'secondary'}
                                                value={field.value.replace(/\s/g, '')}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    <div className='flex w-full items-center justify-between'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='w-24'
                            onClick={onBack}
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                        {step !== 1 && (
                            <Button className='w-24' disabled={isNextButtonDisabled}>
                                {isLoading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : !step ? 'Send email' : 'Reset'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Form>
    );
};
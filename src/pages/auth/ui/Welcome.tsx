import { useAuth } from '@/shared/lib/providers/auth';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';


export const Welcome = () => {
    const changeAuthStage = useAuth((state) => state.changeAuthStage);
    
    return (
        <div className='flex flex-col items-center justify-center w-full gap-5 px-4'>
            <div className='flex flex-col gap-2 items-center'>
                <Typography
                    variant='primary'
                    as='h1'
                    size='6xl'
                    weight='bold'
                    className='max-lg:text-6xl max-md:text-6xl'
                >
                    Syncmate
                </Typography>
                <Typography variant='secondary' as='p' size='lg' className='max-lg:text-lg max-md:text-lg'>
                    What's up?
                </Typography>
            </div>
            <div className='max-w-[320px] w-full flex flex-col gap-2'>
                <Button intent='primary' onClick={() => changeAuthStage('signUp')}>Create new account</Button>
                <Button intent='secondary' onClick={() => changeAuthStage('signIn')}>
                    Sign in
                </Button>
            </div>
        </div>
    );
};
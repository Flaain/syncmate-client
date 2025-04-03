import { SigninForm, SigninProvider } from '@/widgets/SigninForm';
import { SignupForm } from '@/widgets/SignupForm';
import { useAuth } from '../model/store';
import { Welcome } from './Welcome';

const stages = {
    welcome: <Welcome />,
    signIn: (
        <SigninProvider>
            <SigninForm />
        </SigninProvider>
    ),
    signUp: <SignupForm />
};

export const Auth = () => {
    const authStage = useAuth((state) => state.authStage);

    return (
        <section className='w-full h-screen flex items-center px-5 justify-center bg-primary-dark-200'>
            {/* <Toaster /> */}
            {stages[authStage as keyof typeof stages]}
        </section>
    );
};
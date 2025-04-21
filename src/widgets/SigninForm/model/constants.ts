import { SigninStage } from "@/features/Signin";

export const stageDescription: Record<SigninStage, { title: string; description: string }> = {
    signin: {
        title: 'Sign in',
        description: 'Enter your email or login and password'
    },
    forgot: {
        title: 'Forgot password',
        description: "Let's get your password reset!"
    }
};
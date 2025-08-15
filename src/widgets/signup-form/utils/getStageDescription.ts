export const getStageDescription = (isLastStep: boolean, email: string) => ({
    title: isLastStep ? 'Verify email' : 'Sign up',
    description: isLastStep ? `We’ve sent an email to ${email} with a OTP code to verify your email` : "We're so excited to have you join us!"
});
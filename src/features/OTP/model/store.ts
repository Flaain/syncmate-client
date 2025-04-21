import { create } from 'zustand';

import { toast } from '@/shared/lib/toast';

import { otpApi } from '../api';

import { OtpStore } from './types';

export const useOtp = create<OtpStore>((set, get) => ({
    otp: null!,
    isResending: false,
    onResend: async () => {
        try {
            set({ isResending: true });

            const { otp } = get();
            const { data: { retryDelay } } = await otpApi.create({ email: otp.targetEmail, type: otp.type });

            set({ otp: { ...otp, retryDelay } });
        } catch (error) {
            console.error(error);
            toast.error('Cannot resend OTP code');
        } finally {
            set({ isResending: false });
        }
    }
}));
import { useSession } from "@/entities/session";
import { debounce } from "@/shared/lib/utils/debounce";
import { SetStateInternal } from "@/shared/model/types";
import { toast } from "sonner";
import { profileApi } from "../api";
import { imageValidators } from "./constants";
import { ProfileStore } from "./types";

export const profileActions = (set: SetStateInternal<ProfileStore>, get: () => ProfileStore): ProfileStore['actions'] => ({
    getProfile: async () => {
        try {
            const { data } = await profileApi.getProfile();

            set({ profile: data });

            useSession.getState().actions.onSignin(data._id);
        } catch (error) {
            console.error(error);
        } finally {
            useSession.setState({ isAuthInProgress: false });
        }
    },
    handleSetStatus: debounce(async (status: string) => {
        try {
            await profileApi.status({ status });

            set((prevState) => ({ profile: { ...prevState.profile, status } }));
        } catch (error) {
            console.error(error);
        }
    }, 500),
    handleUploadAvatar: async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length || get().isUploadingAvatar) return;

        try {
            set({ isUploadingAvatar: true });

            const file = event.target.files[0];
            const validator = imageValidators.find(({ isValid }) => !isValid(file));

            if (validator) return toast.error(validator.message, { position: 'top-center' });

            const form = new FormData();

            form.append('image', new Blob([file], { type: file.type }));

            const { data } = await profileApi.avatar(form);

            set((prevState) => ({ profile: { ...prevState.profile, avatar: data } }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot upload image', { position: 'top-center' });

            event.target.value = ''; // reset value to prevent caching
        } finally {
            set({ isUploadingAvatar: false });
        }
    },
})
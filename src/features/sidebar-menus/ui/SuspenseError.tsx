import { SidebarMenuError } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

export const SuspenseError = ({ name, skeleton }: { name: string; skeleton: React.ReactNode }) => (
    <SidebarMenuError bgSkeleton={skeleton}>
        <Typography align='center' weight='medium'>
            An error occurred while loading {name}
        </Typography>
    </SidebarMenuError>
);
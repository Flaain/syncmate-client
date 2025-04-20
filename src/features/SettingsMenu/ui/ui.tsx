import CameraAddIcon from '@/shared/lib/assets/icons/cameraadd.svg?react'
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react'
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu'
import { SidebarMenuProps } from '@/shared/model/types'
import { SettingMenus } from '../model/types'
import { useProfile } from '@/entities/profile'
import { useShallow } from 'zustand/shallow'
import { Image } from '@/shared/ui/Image'
import { AvatarByName } from '@/shared/ui/AvatarByName'
import { Typography } from '@/shared/ui/Typography'
import { AtSign, Mail } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SidebarMenuButton, SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu'
import { toast } from '@/shared/lib/toast'

const iconStyles = 'size-6 text-primary-white/60';

export const SettingsMenu = ({ onClose, backToParent }: SidebarMenuProps) => {
    const { handleBack, onAnimationEnd, changeMenu, activeMenu, panelRef, shouldRemove } = useSidebarMenu<SettingMenus, HTMLDivElement>({ onClose, backToParent })
    const { email, name, avatar, login } = useProfile(useShallow((state) => state.profile))

    const handleCopy = (type: 'Email' | 'Login', value: string) => {
        navigator.clipboard.writeText(value)
        toast.success(`${type} copied to clipboard`)
    }

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            hasActiveMenu={!!activeMenu}
            onAnimationEnd={onAnimationEnd}
        >
            <SidebarMenuHeader title='Settings' onBack={handleBack} />
            <div className='px-4 pt-4 pb-2 flex flex-col border-b-[12px] border-solid border-primary-dark-200 relative'>
                <div className='flex flex-col mb-5'>
                    <Image
                        className='size-32 rounded-full self-center border border-solid border-primary-blue'
                        src={avatar?.url}
                        skeleton={<AvatarByName name={name} className='size-32 self-center' size='5xl' />}
                    />
                    <Typography size='2xl' weight='medium' className='flex self-center pt-2 line-clamp-1'>
                        {name}
                    </Typography>
                </div>
                <SidebarMenuButton
                    title={email}
                    description='Email'
                    onClick={() => handleCopy('Email', email)}
                    icon={<Mail className={iconStyles} />}
                />
                <SidebarMenuButton
                    title={login.substring(0, 1).toUpperCase() + login.substring(1)}
                    description='Login'
                    onClick={() => handleCopy('Login', login)}
                    icon={<AtSign className={iconStyles} />}
                />
                <Button
                    variant='text'
                    size='icon'
                    className='absolute right-4 top-1/2 rounded-full size-14 bg-primary-blue'
                >
                    <CameraAddIcon className='size-6' />
                </Button>
            </div>
            <ul className='px-4 pt-2 pb-2 flex flex-col'>
                <li className='flex'>
                    <SidebarMenuButton
                        className='py-4 flex-1'
                        title='Privacy and Security'
                        onClick={() => changeMenu('privacy')}
                        icon={<LockIcon className={iconStyles} />}
                    />
                </li>
            </ul>
        </SidebarMenuContainer>
    )
}

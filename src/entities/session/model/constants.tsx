import ChromeLogo from '@/shared/lib/assets/icons/chrome.svg?react';
import FireFoxLogo from '@/shared/lib/assets/icons/firefox.svg?react';
import SafariLogo from '@/shared/lib/assets/icons/safari.svg?react';
import EdgeLogo from '@/shared/lib/assets/icons/edge.svg?react';
import { BotIcon } from 'lucide-react';

const iconStyles = 'size-7 dark:fill-primary-white fill-primary-dark-50';

export const iconsMap: Record<'browser' | 'robot', Record<string, React.ReactNode>> = {
    browser: {
        Chrome: <ChromeLogo className={iconStyles} />,
        Firefox: <FireFoxLogo className={iconStyles} />,
        Safari: <SafariLogo className={iconStyles} />,
        Edge: <EdgeLogo className={iconStyles} />
    },
    robot: { default: <BotIcon className={iconStyles} /> }
};
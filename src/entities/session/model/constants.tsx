import ChromeLogo from '@/shared/lib/assets/icons/browsers/chrome.svg?react';
import EdgeLogo from '@/shared/lib/assets/icons/browsers/edge.svg?react';
import FireFoxLogo from '@/shared/lib/assets/icons/browsers/firefox.svg?react';
import SafariLogo from '@/shared/lib/assets/icons/browsers/safari.svg?react';

const iconStyles = 'size-7 dark:fill-primary-white fill-primary-dark-50';

export const iconsMap: Record<string, React.ReactNode> = {
    Chrome: <ChromeLogo className={iconStyles} />,
    Firefox: <FireFoxLogo className={iconStyles} />,
    Safari: <SafariLogo className={iconStyles} />,
    Edge: <EdgeLogo className={iconStyles} />
};
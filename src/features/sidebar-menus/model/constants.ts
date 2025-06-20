import { PrivacyAndSecurity } from './types';

export const settingsMap: Record<
    keyof PrivacyAndSecurity,
    { title: string; description?: string; setting: string; isViewPermission?: boolean }
> = {
    whoCanSeeMyEmail: {
        title: 'Email Address',
        setting: 'Who can see my email address?',
        isViewPermission: true
    },
    whoCanSeeMyLastSeenTime: {
        title: 'Last Seen & Online',
        setting: 'Who can see my Last Seen time?',
        description:
            "You won't see Last Seen or Online statuses for people with whom you don't share yours. Approximate times will be shown instead (recently, within a week, within a month).",
        isViewPermission: true
    },
    whoCanSeeMyProfilePhotos: {
        title: 'Profile Photos',
        setting: 'Who can see my profile photos?',
        description: 'You can restrict who can see your profile photo with granular precision.',
        isViewPermission: true
    },
    whoCanSeeMyBio: {
        title: 'Bio',
        setting: 'Who can see my bio?',
        description: 'You can restrict who can see the bio on your profile with granular precision.',
        isViewPermission: true
    },
    whoCanLinkMyProfileViaForward: {
        title: 'Forwarded Messages',
        setting: 'Who can add a link to my account when forwarding my messages?',
        description: 'You can restrict who can add a link to your account when forwarding your messages.'
    },
    whoCanAddMeToGroupChats: {
        title: 'Group chats',
        setting: 'Who can add me to group chats?',
        description: 'You can restrict who can add you to groups and channels with granular precision.'
    },
    whoCanSendMeMessages: {
        title: 'Messages',
        setting: 'Who can send me messages?',
        description: 'You can restrict messages from users who are not in your contacts.'
    }
};
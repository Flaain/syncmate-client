import { lazyWithRetries } from '@/shared/lib/utils/lazyWithRetries';

export const Settings = lazyWithRetries('Settings', () => import('../ui/Settings').then((module) => ({ default: module.Settings })))
export const Profile = lazyWithRetries('Profile', () => import('../ui/Profile').then((module) => ({ default: module.Profile })));
export const DataStorage = lazyWithRetries('DataStorage', () => import('../ui/DataStorage').then((module) => ({ default: module.DataStorage })));
export const Sessions = lazyWithRetries('Sessions', () => import('../ui/Sessions').then((module) => ({ default: module.Sessions })));
export const Privacy = lazyWithRetries('Privacy', () => import('../ui/Privacy').then((module) => ({ default: module.Privacy })));
export const PrivacySetting = lazyWithRetries('PrivacySetting', () => import('../ui/PrivacySetting').then((module) => ({ default: module.PrivacySetting })));
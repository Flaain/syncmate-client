import { create } from 'zustand';

import { getTheme } from '../lib/getTheme';

import { Theme } from './types';

export const useTheme = create<{ theme: Theme }>(() => ({ theme: getTheme() }));
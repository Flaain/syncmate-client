import { API } from './API';

export const api = new API({ baseUrl: import.meta.env.VITE_BASE_URL, credentials: 'include' })
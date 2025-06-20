import { PrivacyMode } from "../model/types";

export const isCorrectMode = (n: number): n is PrivacyMode => n === 0 || n === 1;
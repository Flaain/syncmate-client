import { Navigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useSession } from "@/entities/session";

import { routerList } from "@/shared/constants";

export type GUARD_TYPE = 'auth' | 'guest';

export interface GuardProps {
    type: GUARD_TYPE;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const Guard = ({ type, children, fallback }: GuardProps) => {
    const { isAuthInProgress, isAuthorized } = useSession(useShallow((state) => ({
        isAuthInProgress: state.isAuthInProgress,
        isAuthorized: state.isAuthorized
    })));

    if (isAuthInProgress) return fallback;

    const guards: Record<GUARD_TYPE, React.ReactNode> = {
        auth: isAuthorized ? <Navigate to={routerList.HOME} replace /> : children,
        guest: isAuthorized ? children : <Navigate to={routerList.AUTH} replace />
    };

    return guards[type];
};
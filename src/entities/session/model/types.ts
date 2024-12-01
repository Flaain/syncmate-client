export interface ParsedSession {
    header: string;
    name: string;
    type: string;
    version: string;
    version_major: string;
    device: IDevice;
    engine: IEngine;
    os: IOS;
}

export interface IDevice {
    brand: string;
    name: string;
    type: string;
}

export interface IEngine {
    name: string;
    tpye: string;
    version: string;
    version_major: string;
}

export interface IOS {
    name: string;
    type: string;
    version: string | null;
}

export interface Session {
    _id: string;
    userAgent: ParsedSession | null;
    userIP: null;
    createdAt: string;
    expiresAt: string;
}

export interface SessionProps {
    session: Session;
    withDropButton?: boolean;
    dropButtonDisabled?: boolean;
    onDrop?: (session: Session) => void;
}

export interface GetSessionsReturn {
    currentSession: Session;
    sessions: Array<Session>;
}

export interface SessionStore {
    userId: string;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
    actions: {
        onSignout: () => void;
        onSignin: (userId: string) => void;
    }
}
interface IBrowser {
    name?: string;
    version?: string;
    major?: string;
    type?: 'crawler' | 'cli' | 'email' | 'fetcher' | 'inapp' | 'mediaplayer' | 'library';
}

interface ICPU {
    architecture?: 'ia32' | 'ia64' | 'amd64' | 'arm' | 'arm64' | 'armhf' | 'avr' | 'avr32' | 'irix' | 'irix64' | 'mips' | 'mips64' | '68k' | 'pa-risc' | 'ppc' | 'sparc' | 'sparc64';
}

interface IDevice {
    type?: 'mobile' | 'tablet' | 'console' | 'smarttv' | 'wearable' | 'xr' | 'embedded';
    vendor?: string;
    model?: string;
}

interface IEngine {
    name?: 'Amaya' | 'ArkWeb' | 'Blink' | 'EdgeHTML' | 'Flow' | 'Gecko' | 'Goanna' | 'iCab' | 'KHTML' | 'LibWeb' | 'Links' | 'Lynx' | 'NetFront' | 'NetSurf' | 'Presto' | 'Servo' | 'Tasman' | 'Trident' | 'w3m' | 'WebKit';
    version?: string;
}

interface IOS {
    name?: string;
    version?: string;
}

interface IResult {
    ua: string;
    browser: IBrowser;
    cpu: ICPU; 
    device: IDevice;
    engine: IEngine; 
    os: IOS;
}

export interface Session {
    _id: string;
    userAgent: IResult;
    createdAt: string;
    expiresAt: string;
}

export interface SessionProps {
    session: Session;
    isCurrent?: boolean;
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
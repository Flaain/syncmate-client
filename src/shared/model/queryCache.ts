const MAX_CACHE_OPEN_RETRIES = 5;
const CACHE_NAME = 'v1'

export class QueryCache {
    public cache: Cache | null = null;
    
    private readonly state: { isOpened: boolean; retries: number };

    constructor() {
        this.state = {
            isOpened: false,
            retries: MAX_CACHE_OPEN_RETRIES
        };
    }

    async open(): Promise<Cache> {
        if (this.state.isOpened) return this.cache!;
        
        try {
            this.cache = await caches.open(CACHE_NAME);
            
            this.state.isOpened = true;

            return this.cache;
        } catch (error) {
            if (!this.state.retries) {
                this.state.retries = MAX_CACHE_OPEN_RETRIES;
                
                throw new Error('Failed to open cache');
            }
            
            this.state.retries -= 1;

           return this.open();
        }
    }
}
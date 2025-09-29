/**
 * Signed HTTP client for sync operations
 */
export interface SyncHttpClient {
    push(url: string, batch: any): Promise<any>;
    pull(url: string, sinceRev: number): Promise<any>;
}
export declare class SignedHttpClient implements SyncHttpClient {
    private token;
    private baseUrl;
    constructor(token: string, baseUrl: string);
    push(url: string, batch: any): Promise<any>;
    pull(url: string, sinceRev: number): Promise<any>;
}
/**
 * Utility function for signed fetch
 */
export declare function signedFetch(url: string, token: string, body?: any): Promise<any>;
/**
 * Retry mechanism for network requests
 */
export declare function retryFetch(fn: () => Promise<any>, maxRetries?: number, delay?: number): Promise<any>;

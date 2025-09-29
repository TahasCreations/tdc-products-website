/**
 * Signed HTTP client for sync operations
 */
export class SignedHttpClient {
    token;
    baseUrl;
    constructor(token, baseUrl) {
        this.token = token;
        this.baseUrl = baseUrl;
    }
    async push(url, batch) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-sync-token': this.token,
                'User-Agent': 'TDC-Sync-Client/1.0'
            },
            body: JSON.stringify(batch)
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
    async pull(url, sinceRev) {
        const response = await fetch(`${this.baseUrl}${url}?sinceRev=${sinceRev}`, {
            method: 'GET',
            headers: {
                'x-sync-token': this.token,
                'User-Agent': 'TDC-Sync-Client/1.0'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
}
/**
 * Utility function for signed fetch
 */
export async function signedFetch(url, token, body) {
    const options = {
        method: body ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-sync-token': token,
            'User-Agent': 'TDC-Sync-Client/1.0'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}
/**
 * Retry mechanism for network requests
 */
export async function retryFetch(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }
    }
    throw lastError;
}

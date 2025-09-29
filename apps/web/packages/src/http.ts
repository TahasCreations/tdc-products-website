/**
 * Signed HTTP client for sync operations
 */

export interface SyncHttpClient {
  push(url: string, batch: any): Promise<any>
  pull(url: string, sinceRev: number): Promise<any>
}

export class SignedHttpClient implements SyncHttpClient {
  constructor(
    private token: string,
    private baseUrl: string
  ) {}

  async push(url: string, batch: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sync-token': this.token,
        'User-Agent': 'TDC-Sync-Client/1.0'
      },
      body: JSON.stringify(batch)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  async pull(url: string, sinceRev: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}${url}?sinceRev=${sinceRev}`, {
      method: 'GET',
      headers: {
        'x-sync-token': this.token,
        'User-Agent': 'TDC-Sync-Client/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}

/**
 * Utility function for signed fetch
 */
export async function signedFetch(
  url: string,
  token: string,
  body?: any
): Promise<any> {
  const options: RequestInit = {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-sync-token': token,
      'User-Agent': 'TDC-Sync-Client/1.0'
    }
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Retry mechanism for network requests
 */
export async function retryFetch(
  fn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError!
}

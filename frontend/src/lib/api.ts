/**
 * Inspired by https://github.com/PostHog/posthog/blob/master/frontend/src/lib/api.ts
 */

import Cookies from "js-cookie"
import { toParams, prepareUrl, objectClean } from "./utils"
import { LoginType, TokenType, UserType } from "../types"

const PAGINATION_DEFAULT_MAX_PAGES = 10

export interface ApiMethodOptions {
    signal?: AbortSignal
    headers?: Record<string, any>
}

export async function getJSONOrNull(response: Response): Promise<any> {
    try {
        return await response.json()
    } catch (e) {
        return null
    }
}

export interface PaginatedResponse<T> {
    results: T[]
    next?: string | null
    previous?: string | null
}

export class ApiError extends Error {
    /** Django REST Framework `detail` - used in downstream error handling. */
    detail: string | null
    /** Django REST Framework `code` - used in downstream error handling. */
    code: string | null
    /** Django REST Framework `statusText` - used in downstream error handling. */
    statusText: string | null

    /** Link to external resources, e.g. stripe invoices */
    link: string | null

    constructor(message?: string, public status?: number, public data?: any) {
        message = message || `API request failed with status: ${status ?? 'unknown'}`
        super(message)
        this.statusText = data?.statusText || null
        this.detail = data?.detail || null
        this.code = data?.code || null
        this.link = data?.link || null
    }
}

export class ApiConfig {
    static getAccessToken(): string | undefined {
        return Cookies.get('access_token')
    }

    static getRefreshToken(): string | undefined {
        return Cookies.get('refresh_token')
    }

    static persistToken(token: TokenType): void {
        ApiConfig.setAccessToken(token.access)
        ApiConfig.setRefreshToken(token.refresh)
    }

    static setAccessToken(token: string): void {
        Cookies.set('access_token', token, { secure: true, sameSite: 'strict' })
    }

    static setRefreshToken(token: string): void {
        Cookies.set('refresh_token', token, { secure: true, sameSite: 'strict' })
    }
}

class ApiRequest {
    private pathComponents: string[]
    private queryString: string | undefined

    constructor() {
        this.pathComponents = []
    }

    // URL assembly
    public assembleEndpointUrl(): string {
        let url = this.pathComponents.join('/')
        if (this.queryString) {
            if (!this.queryString.startsWith('?')) {
                url += '?'
            }
            url += this.queryString
        }
        return url
    }

    public assembleFullUrl(includeLeadingSlash = false): string {
        return (includeLeadingSlash ? '/api/' : 'api/') + this.assembleEndpointUrl()
    }

    // Generic endpoint composition
    private addPathComponent(component: string | number): ApiRequest {
        this.pathComponents.push(component.toString())
        return this
    }

    public withQueryString(queryString?: string | Record<string, any>): ApiRequest {
        this.queryString = typeof queryString === 'object' ? toParams(queryString) : queryString
        return this
    }

    public withAction(apiAction: string): ApiRequest {
        return this.addPathComponent(apiAction)
    }

    // Request finalization
    public async get(options?: ApiMethodOptions): Promise<any> {
        return await api.get(this.assembleFullUrl(), options)
    }

    public async getResponse(options?: ApiMethodOptions): Promise<Response> {
        return await api.getResponse(this.assembleFullUrl(), options)
    }

    public async update(options?: ApiMethodOptions & { data: any }): Promise<any> {
        return await api.patch(this.assembleFullUrl(), options?.data, options)
    }

    public async post(options?: ApiMethodOptions & { data: any }): Promise<any> {
        return await api.post(this.assembleFullUrl(), options?.data, options)
    }

    public async delete(): Promise<any> {
        return await api.delete(this.assembleFullUrl())
    }
}

export const api = {
    auth: {
        async login(data: Partial<LoginType>): Promise<TokenType> {
            return new ApiRequest()
                .withAction('token')
                .post({ data })
        },
        async getCurrentUser(): Promise<UserType> {
            return new ApiRequest().withAction('users/@me').get()
        },
        async logout(): Promise<void> {
            return new ApiRequest().delete()
        },
    },

    /** Fetch data from specified URL. The result already is JSON-parsed. */
    async get<T = any>(url: string, options?: ApiMethodOptions): Promise<T> {
        const res = await api.getResponse(url, options)
        return await getJSONOrNull(res)
    },

    async getResponse(url: string, options?: ApiMethodOptions): Promise<Response> {
        url = prepareUrl(url)
        return await handleFetch(url, 'GET', () => {
            return fetch(url, {
                signal: options?.signal,
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    "Authorization": `Bearer ${ApiConfig.getAccessToken()}`
                },
            })
        })
    },

    async patch(url: string, data: any, options?: ApiMethodOptions): Promise<any> {
        url = prepareUrl(url)
        const isFormData = data instanceof FormData

        const response = await handleFetch(url, 'PATCH', async () => {
            return await fetch(url, {
                method: 'PATCH',
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' })
                },
                body: isFormData ? data : JSON.stringify(data),
                signal: options?.signal,
            })
        })

        return await getJSONOrNull(response)
    },

    async post(url: string, data?: any, options?: ApiMethodOptions): Promise<any> {
        const res = await api.postResponse(url, data, options)
        return await getJSONOrNull(res)
    },

    async postResponse(url: string, data?: any, options?: ApiMethodOptions): Promise<Response> {
        url = prepareUrl(url)
        const isFormData = data instanceof FormData

        return await handleFetch(url, 'POST', () =>
            fetch(url, {
                method: 'POST',
                headers: {
                    ...objectClean(options?.headers ?? {}),
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                },
                body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
                signal: options?.signal,
            })
        )
    },

    async delete(url: string): Promise<any> {
        url = prepareUrl(url)
        return await handleFetch(url, 'DELETE', () =>
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
        )
    },

    async loadPaginatedResults<T extends Record<string, any>>(
        url: string | null,
        maxIterations: number = PAGINATION_DEFAULT_MAX_PAGES
    ): Promise<T[]> {
        let results: T[] = []
        for (let i = 0; i <= maxIterations; ++i) {
            if (!url) {
                break
            }

            const { results: partialResults, next } = await api.get(url)
            results = results.concat(partialResults)
            url = next
        }
        return results
    },
}

async function handleFetch(url: string, method: string, fetcher: () => Promise<Response>): Promise<Response> {
    const startTime = new Date().getTime()

    let response
    let error
    try {
        response = await fetcher()
    } catch (e) {
        error = e
    }

    if (error || !response) {
        if (error && (error as any).name === 'AbortError') {
            throw error
        }
        throw new ApiError(error as any, response?.status)
    }

    if (!response.ok) {
        const data = await getJSONOrNull(response)
        throw new ApiError('Api Error', response.status, data)
    }

    return response
}
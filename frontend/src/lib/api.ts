/**
 * Inspired by https://github.com/PostHog/posthog/blob/master/frontend/src/lib/api.ts
 */

import Cookies from "js-cookie"
import { toParams, prepareUrl, objectClean } from "./utils"
import { LoginType, Paywall, RefreshRequest, RefreshResponse, TokenResponse, UserType } from "../types"
import { jwtDecode } from 'jwt-decode'
import { CreatePaywallForm } from "../scenes/paywalls/create/createPaywallLogic"
import { ProjectData } from "grapesjs"

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

interface AccessToken {
    token_type: string
    exp: number
    iat: number
    jti: string
    user_id: string
    email: string
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

    static getRefreshToken(): string {
        return Cookies.get('refresh_token') || ''
    }

    static getAccessTokenExpire(): number | undefined {
        const expire = Cookies.get('access_token_exp') || '0'
        return parseInt(expire)
    }

    static isTokenExpired(): boolean {
        const expire = ApiConfig.getAccessTokenExpire()
        if (!expire) {
            return true
        }

        return Date.now() >= expire * 1000
    }

    static persistToken(token: TokenResponse): void {
        ApiConfig.setAccessToken(token.access)
        ApiConfig.setRefreshToken(token.refresh)
    }

    static clearToken(): void {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        Cookies.remove('access_token_exp')
    }

    static setAccessTokenExpire(date: number): void {
        Cookies.set('access_token_exp', date.toString(), { secure: true, sameSite: 'strict' })
    }

    static setAccessToken(token: string): void {
        Cookies.set('access_token', token, { secure: true, sameSite: 'strict' })
        const decodedToken = jwtDecode<AccessToken>(token)
        ApiConfig.setAccessTokenExpire(decodedToken.exp)
    }

    static setRefreshToken(token: string): void {
        Cookies.set('refresh_token', token, { secure: true, sameSite: 'strict' })
    }
}

class ApiRequest {
    private pathComponents: string[]
    private queryString: string | undefined
    private disableTokenRefresh: boolean = false

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
    public withQueryString(queryString?: string | Record<string, any>): ApiRequest {
        this.queryString = typeof queryString === 'object' ? toParams(queryString) : queryString
        return this
    }

    public withoutTokenRefresh(): ApiRequest {
        this.disableTokenRefresh = true
        return this
    }

    public withAction(apiAction: string): ApiRequest {
        return this.addPathComponent(apiAction)
    }

    public async get(options?: ApiMethodOptions): Promise<any> {
        if (!this.disableTokenRefresh) {
            await refreshAccessTokenIfNecessary()
        }
        return await api.get(this.assembleFullUrl(), options)
    }

    public async getResponse(options?: ApiMethodOptions): Promise<Response> {
        if (!this.disableTokenRefresh) {
            await refreshAccessTokenIfNecessary()
        }
        return await api.getResponse(this.assembleFullUrl(), options)
    }

    public async update(options?: ApiMethodOptions & { data: any }): Promise<any> {
        if (!this.disableTokenRefresh) {
            await refreshAccessTokenIfNecessary()
        }
        return await api.patch(this.assembleFullUrl(), options?.data, options)
    }

    public async post(options?: ApiMethodOptions & { data: any }): Promise<any> {
        if (!this.disableTokenRefresh) {
            await refreshAccessTokenIfNecessary()
        }
        return await api.post(this.assembleFullUrl(), options?.data, options)
    }

    public async delete(): Promise<any> {
        if (!this.disableTokenRefresh) {
            await refreshAccessTokenIfNecessary()
        }
        return await api.delete(this.assembleFullUrl())
    }

    private addPathComponent(component: string | number): ApiRequest {
        this.pathComponents.push(component.toString())
        return this
    }
}

export const api = {
    auth: {
        async login(data: Partial<LoginType>): Promise<TokenResponse> {
            return new ApiRequest()
                .withAction('token')
                .post({ data })
        },
        async refreshToken(data: Partial<RefreshRequest>): Promise<RefreshResponse> {
            return new ApiRequest()
                .withoutTokenRefresh()
                .withAction('token/refresh')
                .post({ data })
        },
        async currentUser(): Promise<UserType> {
            return new ApiRequest().withAction('users/@me').get()
        },
        async logout(): Promise<void> {
            return new ApiRequest().delete()
        },
    },

    paywalls: {
        async getPaywalls(): Promise<Paywall[]> {
            return new ApiRequest().withAction('paywalls').get()
        },
        async getPaywall(id: string | number): Promise<Paywall> {
            return new ApiRequest().withAction(`paywalls/${id}`).get()
        },
        async create(data: Partial<CreatePaywallForm>): Promise<Paywall> {
            return new ApiRequest().withAction('paywalls').post({ data })
        },
        async update({ id, data }: { id: string | number, data: ProjectData }): Promise<Paywall> {
            return new ApiRequest().withAction(`paywalls/${id}`).update({ data })
        }
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
                    ...(ApiConfig.getAccessToken() ? { Authorization: `Bearer ${ApiConfig.getAccessToken()}` } : {}),
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
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...(ApiConfig.getAccessToken() ? { Authorization: `Bearer ${ApiConfig.getAccessToken()}` } : {}),
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
                    ...(ApiConfig.getAccessToken() ? { Authorization: `Bearer ${ApiConfig.getAccessToken()}` } : {}),

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
                    ...{ 'Content-Type': 'application/x-www-form-urlencoded' },
                    ...(ApiConfig.getAccessToken() ? { Authorization: `Bearer ${ApiConfig.getAccessToken()}` } : {}),
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

async function refreshAccessTokenIfNecessary() {
    if (ApiConfig.getRefreshToken() && ApiConfig.isTokenExpired()) {
        const { access } = await api.auth.refreshToken({ refresh: ApiConfig.getRefreshToken() })
        ApiConfig.setAccessToken(access)
    }
}

async function handleFetch(url: string, method: string, fetcher: () => Promise<Response>): Promise<Response> {
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

    if (response.status === 401) {
        ApiConfig.clearToken()
    }

    if (!response.ok) {
        const data = await getJSONOrNull(response)
        throw new ApiError('Api Error', response.status, data)
    }

    return response
}
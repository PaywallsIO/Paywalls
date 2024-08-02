import { objectClean } from "./utils"
import axios from 'axios'
import { backendHost } from "./constants"
import createAuthRefreshInterceptor from 'axios-auth-refresh'

export interface ApiMethodOptions {
    signal?: AbortSignal
    headers?: Record<string, any>
}

export interface Paginated<T> {
    current_page: number
    data: T[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}

export interface ApiClientInterface {
    get(url: string, options?: ApiMethodOptions): Promise<any>
    post(url: string, data?: any, options?: ApiMethodOptions): Promise<any>
    patch(url: string, data?: any, options?: ApiMethodOptions): Promise<any>
    delete(url: string, options?: ApiMethodOptions): Promise<any>
}

export class ApiClient implements ApiClientInterface {
    constructor() {
        axios.defaults.withCredentials = true
        axios.defaults.withXSRFToken = true
        axios.defaults.baseURL = backendHost

        this.setupRefreshLogic()
    }

    private setupRefreshLogic() {
        const refreshAuthLogic = async (): Promise<void> => { await axios.get('/sanctum/csrf-cookie') }
        createAuthRefreshInterceptor(axios, refreshAuthLogic, { statusCodes: [419] })
    }

    async get(url: string, options?: ApiMethodOptions): Promise<any> {
        return (await axios.get(url, { headers: objectClean(options?.headers ?? {}) })).data
    }

    async post(url: string, data?: any, options?: ApiMethodOptions): Promise<any> {
        return (await axios.post(url, data, { headers: objectClean(options?.headers ?? {}) })).data
    }

    async patch(url: string, data?: any, options?: ApiMethodOptions): Promise<any> {
        return (await axios.patch(url, data, { headers: objectClean(options?.headers ?? {}) })).data
    }

    async delete(url: string, options?: ApiMethodOptions): Promise<any> {
        return (await axios.delete(url, { headers: objectClean(options?.headers ?? {}) })).data
    }
}

export const apiClient = new ApiClient()
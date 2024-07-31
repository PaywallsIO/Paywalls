import { toParams, prepareUrl, objectClean } from "./utils"
import { Paywall, TokenResponse, UserType } from "../types"
import { ProjectData } from "grapesjs"
import axios from 'axios'

export interface ApiMethodOptions {
    signal?: AbortSignal
    headers?: Record<string, any>
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
    }

    async get(url: string, options?: ApiMethodOptions): Promise<any> {
        url = prepareUrl(url)
        return (await axios.get(url, { headers: objectClean(options?.headers ?? {}) })).data
    }

    async post(url: string, data?: any, options?: ApiMethodOptions): Promise<any> {
        url = prepareUrl(url)
        return (await axios.post(url, data, { headers: objectClean(options?.headers ?? {}) })).data
    }

    async patch(url: string, data?: any, options?: ApiMethodOptions): Promise<any> {
        url = prepareUrl(url)
        return (await axios.patch(url, data, { headers: objectClean(options?.headers ?? {}) })).data
    }

    async delete(url: string, options?: ApiMethodOptions): Promise<any> {
        url = prepareUrl(url)
        return (await axios.delete(url, { headers: objectClean(options?.headers ?? {}) })).data
    }
}

export const apiClient = new ApiClient()
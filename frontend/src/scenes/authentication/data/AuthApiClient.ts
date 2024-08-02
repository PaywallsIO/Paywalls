import { UserType } from "../../../types"
import { ApiClientInterface } from "../../../lib/api"

interface AuthApiClientInterface {
    csrfToken(): Promise<string>
    login(data: Partial<LoginRequest>): Promise<LoginResponse>
    currentUser(): Promise<UserType>
    logout(): Promise<void>
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    two_factor: string
}

export class AuthApiClient implements AuthApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async csrfToken(): Promise<string> {
        return await this.api.get('/sanctum/csrf-cookie')
    }

    async login(data: Partial<LoginRequest>): Promise<LoginResponse> {
        return await this.api.post('/login', data)
    }

    async currentUser(): Promise<UserType> {
        return await this.api.get('api/user')
    }

    async logout(): Promise<void> {
        return await this.api.post('/logout')
    }
}

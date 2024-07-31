export type Paywall = {
    id: number
    name: string
    created_at: string
    updated_at: string
    content: Object
}

export type TokenResponse = {
    refresh: string
    access: string
}

export type UpdatePaywallRequest = {
    content: string
    version: number
}

export type UserType = {
    id: number
    email: string
    name: string
    email_verified_at?: string
    created_at: string
    updated_at?: string
}
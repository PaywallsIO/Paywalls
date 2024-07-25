export type Paywall = {
    id: number
    name: string
    created_at: string
    updated_at: string
    content: Object
}

export type LoginType = {
    email: string
    password: string
}

export type TokenResponse = {
    refresh: string
    access: string
}

export type RefreshRequest = {
    refresh: string
}

export type RefreshResponse = {
    access: string
}

export type UpdatePaywallRequest = {
    content: string
    version: number
}

export type UserType = {
    id: number
    email: string
    first_name: string
    last_name: string
    is_staff: boolean
    is_active: boolean
    date_joined: string
    last_login: string
}
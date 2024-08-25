export type TokenResponse = {
    refresh: string
    access: string
}

export type UpdatePaywallRequest = {
    content: string
    version: number
}

export type Portal = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
}

export type UserType = {
    id: number
    portal: Portal
    email: string
    name: string
    email_verified_at?: string
    avatar_url?: string
    current_portal_id: number
    created_at: Date
    updated_at?: Date
}
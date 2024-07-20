export type Paywall = {
    id: number
    name: string
    created_at: string
    updated_at: string
    content: string
}

export type LoginType = {
    email: string
    password: string
}

export type TokenType = {
    refresh: string
    access: string
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
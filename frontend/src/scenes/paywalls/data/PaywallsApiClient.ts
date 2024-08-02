import { ProjectData } from "grapesjs"
import { ApiClientInterface, Paginated } from "../../../lib/api"

interface PaywallsApiClientInterface {
    getPaywalls(): Promise<Paginated<Paywall>>
    getPaywall(id: string | number): Promise<Paywall>
    create(data: Partial<CreatePaywallRequest>): Promise<Paywall>
    update({ id, data }: { id: string | number, data: ProjectData }): Promise<Paywall>
}

export type Paywall = {
    id: number
    name: string
    created_at: string
    updated_at: string
    content: Object
}

export type CreatePaywallRequest = {
    name: string
}

export class PaywallsApiClient implements PaywallsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getPaywalls(): Promise<Paginated<Paywall>> {
        return this.api.get('/api/paywalls')
    }

    async getPaywall(id: string | number): Promise<Paywall> {
        return this.api.get(`/api/paywalls/${id}`)
    }

    async create(data: Partial<CreatePaywallRequest>): Promise<Paywall> {
        return this.api.post('/api/paywalls', data)
    }

    async update({ id, data }: { id: string | number, data: ProjectData }): Promise<Paywall> {
        return this.api.patch(`/api/paywalls/${id}`, data)
    }
}

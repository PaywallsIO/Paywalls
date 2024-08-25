import { ProjectData } from "grapesjs"
import { ApiClientInterface, Paginated } from "../../../lib/api"

export interface PaywallsApiClientInterface {
    getPaywalls(projectId: number): Promise<Paginated<Paywall>>
    getPaywall(projectId: number, id: string | number): Promise<Paywall>
    create(projectId: number, data: Partial<CreatePaywallRequest>): Promise<Paywall>
    update(projectId: number, { id, data }: { id: string | number, data: ProjectData }): Promise<Paywall>
    publish(projectId: number, request: PublishPaywallRequest): Promise<Paywall>
}

export type Paywall = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    content: Object
    project_id: number
}

export type CreatePaywallRequest = {
    name: string
}

interface PublishPaywallRequest {
    id: number
    version: number
    html: string
    css: string
    js: string
}

export class PaywallsApiClient implements PaywallsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getPaywalls(projectId: number): Promise<Paginated<Paywall>> {
        return this.api.get(`/api/projects/${projectId}/paywalls`)
    }

    async getPaywall(projectId: number, id: number): Promise<Paywall> {
        return this.api.get(`/api/projects/${projectId}/paywalls/${id}`)
    }

    async create(projectId: number, data: Partial<CreatePaywallRequest>): Promise<Paywall> {
        return this.api.post(`/api/projects/${projectId}/paywalls`, data)
    }

    async update(projectId: number, { id, data }: { id: number, data: ProjectData }): Promise<Paywall> {
        return this.api.patch(`/api/projects/${projectId}/paywalls/${id}`, data)
    }

    async publish(projectId: number, request: PublishPaywallRequest): Promise<Paywall> {
        return this.api.patch(`/api/projects/${projectId}/paywalls/${request.id}/publish`, request)
    }
}

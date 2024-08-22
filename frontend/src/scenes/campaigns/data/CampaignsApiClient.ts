import { ApiClientInterface, Paginated } from "../../../lib/api"

export interface CampaignsApiClientInterface {
    getCampaigns(projectId: number): Promise<Paginated<Campaign>>
    getCampaign(projectId: number, campaignId: number): Promise<Campaign>
    saveAudience(projectId: number, campaignId: number, data: AudienceRequest): Promise<CampaignAudience>
    create(projectId: number, data: Partial<CreateCampaignRequest>): Promise<Campaign>
}

export type CampaignTrigger = {
    id: number
    campaign_id: number
    event_name: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export type CampaignAudience = {
    id: number
    name: string
    campaign_id: number
    sort_order: number
    filters: any[] // TODO
    match_limit: number | null
    created_at: Date
    updated_at: Date
}

export type Campaign = {
    id: number
    name: string
    project_id: number
    triggers: CampaignTrigger[]
    audiences: CampaignAudience[]
    created_at: Date
    updated_at: Date
}

export type CreateCampaignRequest = {
    name: string
}

export type AudienceRequest = {
    filters: Object
    matchLimit: string | number | null
    matchPeriod: string | number | null
}

export class CampaignsApiClient implements CampaignsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getCampaigns(projectId: number): Promise<Paginated<Campaign>> {
        return this.api.get(`/api/projects/${projectId}/campaigns`)
    }

    async getCampaign(projectId: number, campaignId: number): Promise<Campaign> {
        return this.api.get(`/api/projects/${projectId}/campaigns/${campaignId}`)
    }

    async saveAudience(projectId: number, campaignId: number, data: AudienceRequest): Promise<CampaignAudience> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${campaignId}/audiences`, data)
    }

    async create(projectId: number, data: Partial<CreateCampaignRequest>): Promise<Campaign> {
        return this.api.post('/api/campaigns', data)
    }
}

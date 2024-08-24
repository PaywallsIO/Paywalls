import { ApiClientInterface, Paginated } from "../../../lib/api"

export interface CampaignsApiClientInterface {
    getCampaigns(projectId: number): Promise<Paginated<Campaign>>
    getCampaign(projectId: number, campaignId: number): Promise<Campaign>
    createAudience(projectId: number, campaignId: number, data: CreateAudienceRequest): Promise<CampaignAudience>
    saveAudience(projectId: number, audience: CampaignAudience, data: AudienceRequest): Promise<CampaignAudience>
    updateSortOrder(projectId: number, campaignId: number, audiences: UpdateSortOrderRequest): Promise<Campaign>
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
    filters: any[]
    match_limit: number | null
    match_period: number | null
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

export type CreateAudienceRequest = {
    name: string
}

export type AudienceRequest = {
    filters: Object
    match_limit: string | number | null
    match_period: string | number | null
}

export type UpdateSortOrderRequest = {
    audiences: { id: number, sort_order: number }[]
}

export class CampaignsApiClient implements CampaignsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getCampaigns(projectId: number): Promise<Paginated<Campaign>> {
        return this.api.get(`/api/projects/${projectId}/campaigns`)
    }

    async getCampaign(projectId: number, campaignId: number): Promise<Campaign> {
        return this.api.get(`/api/projects/${projectId}/campaigns/${campaignId}`)
    }

    async createAudience(projectId: number, campaignId: number, data: CreateAudienceRequest): Promise<CampaignAudience> {
        return this.api.post(`/api/projects/${projectId}/campaigns/${campaignId}/audiences`, data)
    }

    async saveAudience(projectId: number, audience: CampaignAudience, data: AudienceRequest): Promise<CampaignAudience> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${audience.campaign_id}/audiences/${audience.id}`, data)
    }

    async updateSortOrder(projectId: number, campaignId: number, audiences: UpdateSortOrderRequest): Promise<Campaign> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${campaignId}/audiences/sort_order`, audiences)
    }

    async create(projectId: number, data: Partial<CreateCampaignRequest>): Promise<Campaign> {
        return this.api.post('/api/campaigns', data)
    }
}

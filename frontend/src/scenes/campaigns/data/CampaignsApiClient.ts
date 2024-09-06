import { apiClient, ApiClientInterface, Paginated } from "../../../lib/api"

export interface CampaignsApiClientInterface {
    getCampaigns(projectId: number): Promise<Paginated<Campaign>>
    getCampaign(projectId: number, campaignId: number): Promise<Campaign>
    create(projectId: number, data: CreateCampaignRequest): Promise<Campaign>

    // Triggers
    createTrigger(projectId: number, campaignId: number, data: CreateTriggerRequest): Promise<void>
    updateTrigger(projectId: number, campaignId: number, triggerId: number, data: EditTriggerRequest): Promise<void>
    deleteTrigger(projectId: number, campaignId: number, triggerId: number): Promise<void>
    restoreTrigger(projectId: number, campaignId: number, triggerId: number): Promise<void>

    // Audiences
    createAudience(projectId: number, campaignId: number, data: CreateEditAudienceRequest): Promise<CampaignAudience>
    saveAudience(projectId: number, audience: CampaignAudience, data: Partial<AudienceRequest>): Promise<CampaignAudience>
    deleteAudience(projectId: number, campaignId: number, audienceId: number): Promise<void>
    restoreAudience(projectId: number, campaignId: number, audienceId: number): Promise<void>
    updateSortOrder(projectId: number, campaignId: number, audiences: UpdateSortOrderRequest): Promise<Campaign>

    // Paywalls
    attachPaywall(projectId: number, campaignId: number, request: AttachCampaignPaywallRequest): Promise<void>
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

export type CampaignPaywall = {
    id: number
    name: string
    preview_image_url: string | null
    pivot: {
        percentage: number
    }
}

export type Campaign = {
    id: number
    name: string
    project_id: number
    triggers: CampaignTrigger[]
    audiences: CampaignAudience[]
    paywalls: CampaignPaywall[]
    created_at: Date
    updated_at: Date
}

export type CreateCampaignRequest = {
    name: string
}

export type CreateEditAudienceRequest = {
    name: string
}

export type AudienceRequest = {
    name?: string
    filters: Object
    match_limit: string | number | null
    match_period: string | number | null
}

export type UpdateSortOrderRequest = {
    audiences: { id: number, sort_order: number }[]
}

export type CreateTriggerRequest = {
    event_name: string
}

export type EditTriggerRequest = {
    is_active: boolean
}

export type AttachCampaignPaywallRequest = {
    paywall_id: number | null // @davidmoreen can be null in form default but will fail server side validation if null is sent
}

export class CampaignsApiClient implements CampaignsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getCampaigns(projectId: number): Promise<Paginated<Campaign>> {
        return this.api.get(`/api/projects/${projectId}/campaigns`)
    }

    async getCampaign(projectId: number, campaignId: number): Promise<Campaign> {
        return this.api.get(`/api/projects/${projectId}/campaigns/${campaignId}`)
    }

    async create(projectId: number, data: Partial<CreateCampaignRequest>): Promise<Campaign> {
        return this.api.post(`/api/projects/${projectId}/campaigns`, data)
    }

    async createAudience(projectId: number, campaignId: number, data: CreateEditAudienceRequest): Promise<CampaignAudience> {
        return this.api.post(`/api/projects/${projectId}/campaigns/${campaignId}/audiences`, data)
    }

    async deleteAudience(projectId: number, campaignId: number, audienceId: number): Promise<void> {
        return this.api.delete(`/api/projects/${projectId}/campaigns/${campaignId}/audiences/${audienceId}`)
    }

    async restoreAudience(projectId: number, campaignId: number, audienceId: number): Promise<void> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${campaignId}/audiences/${audienceId}/restore`)
    }

    async saveAudience(projectId: number, audience: CampaignAudience, data: Partial<AudienceRequest>): Promise<CampaignAudience> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${audience.campaign_id}/audiences/${audience.id}`, data)
    }

    async updateSortOrder(projectId: number, campaignId: number, audiences: UpdateSortOrderRequest): Promise<Campaign> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${campaignId}/audiences/sort_order`, audiences)
    }

    async createTrigger(projectId: number, campaignId: number, data: CreateTriggerRequest): Promise<void> {
        return this.api.post(`/api/projects/${projectId}/campaigns/${campaignId}/triggers`, data)
    }

    async updateTrigger(projectId: number, campaignId: number, triggerId: number, data: EditTriggerRequest): Promise<void> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${campaignId}/triggers/${triggerId}`, data)
    }

    async deleteTrigger(projectId: number, campaignId: number, triggerId: number): Promise<void> {
        return this.api.delete(`/api/projects/${projectId}/campaigns/${campaignId}/triggers/${triggerId}`)
    }

    async restoreTrigger(projectId: number, campaignId: number, triggerId: number): Promise<void> {
        return this.api.patch(`/api/projects/${projectId}/campaigns/${campaignId}/triggers/${triggerId}/restore`)
    }

    async attachPaywall(projectId: number, campaignId: number, request: AttachCampaignPaywallRequest): Promise<void> {
        return this.api.post(`/api/projects/${projectId}/campaigns/${campaignId}/attach_paywall`, request)
    }
}

export const campaignsApiClient: CampaignsApiClientInterface = new CampaignsApiClient(apiClient)
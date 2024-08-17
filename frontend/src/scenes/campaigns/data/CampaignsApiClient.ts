import { ApiClientInterface, Paginated } from "../../../lib/api"

export interface CampaignsApiClientInterface {
    getCampaigns(projectId: number): Promise<Paginated<Campaign>>
    getCampaign(projectId: number, campaignId: number): Promise<Campaign>
    create(projectId: number, data: Partial<CreateCampaignRequest>): Promise<Campaign>
}

export type Campaign = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
}

export type CreateCampaignRequest = {
    name: string
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
        return this.api.post('/api/campaigns', data)
    }
}

import { ApiClientInterface, Paginated } from "../../../lib/api"

interface CampaignsApiClientInterface {
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

    async getCampaigns(): Promise<Paginated<Campaign>> {
        return this.api.get('/api/campaigns')
    }

    async getCampaign(id: string | number): Promise<Campaign> {
        return this.api.get(`/api/campaigns/${id}`)
    }

    async create(data: Partial<CreateCampaignRequest>): Promise<Campaign> {
        return this.api.post('/api/campaigns', data)
    }
}

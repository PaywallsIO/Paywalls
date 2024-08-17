import { afterMount, kea, path, actions, defaults, key, props } from 'kea'
import { loaders } from 'kea-loaders'
import { Campaign, CampaignsApiClient, CampaignsApiClientInterface } from './data/CampaignsApiClient'
import { apiClient, Paginated } from '../../lib/api'
import type { campaignLogicType } from './campaignLogicType'

export type CampaignProps = {
    projectId: number
    campaignId: number
}

const campaignsApiClient: CampaignsApiClientInterface = new CampaignsApiClient(apiClient)

export const campaignLogic = kea<campaignLogicType>([
    props({} as CampaignProps),
    path((key) => ['scenes', 'campaigns', 'campaignLogic', key]),
    key(({ campaignId }) => campaignId),
    defaults({
        campaign: {} as Campaign,
    }),
    actions({
        loadCampaigns: () => ({}),
    }),
    loaders(({ props }) => ({
        campaign: {
            loadCampaign: async () => {
                return await campaignsApiClient.getCampaign(props.projectId, props.campaignId)
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadCampaign()
    }),
])

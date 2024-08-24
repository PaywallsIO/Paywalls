import { afterMount, kea, path, actions, defaults, key, props, selectors } from 'kea'
import { loaders } from 'kea-loaders'
import { Campaign, CampaignAudience, CampaignsApiClient, CampaignsApiClientInterface, UpdateSortOrderRequest } from './data/CampaignsApiClient'
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
    key((props) => props.campaignId),
    defaults({
        campaign: {} as Campaign,
    }),
    selectors({
        projectId: [() => [(_, props) => props], (props): number => props.projectId],
        campaignId: [() => [(_, props) => props], (props): number => props.campaignId],
    }),
    loaders(({ props }) => ({
        campaign: {
            loadCampaign: async () => {
                return await campaignsApiClient.getCampaign(props.projectId, props.campaignId)
            },
            updateSortOrder: async (request: UpdateSortOrderRequest) => {
                return await campaignsApiClient.updateSortOrder(props.projectId, props.campaignId, request)
            }
        },
    })),
    afterMount(({ actions }) => {
        actions.loadCampaign()
    }),
])

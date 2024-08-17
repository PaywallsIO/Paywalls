import { afterMount, kea, path, actions, defaults, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import { Campaign, CampaignsApiClient } from './data/CampaignsApiClient'
import { apiClient, Paginated } from '../../lib/api'
import type { campaignsLogicType } from './campaignsLogicType'

const campaignsApiClient = new CampaignsApiClient(apiClient)

const campaignsLogic = kea<campaignsLogicType>([
    path(['scenes', 'campaigns', 'campaignsLogic']),
    defaults({
        campaigns: {} as Paginated<Campaign>,
    }),
    actions({
        loadCampaigns: () => ({}),
    }),
    loaders(({ }) => ({
        campaigns: {
            loadCampaigns: async () => {
                return await campaignsApiClient.getCampaigns()
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadCampaigns()
    }),
])

export default campaignsLogic

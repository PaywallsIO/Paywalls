import { afterMount, kea, path, actions, defaults, listeners, props } from 'kea'
import { loaders } from 'kea-loaders'
import { Campaign, CampaignsApiClient, CampaignsApiClientInterface } from './data/CampaignsApiClient'
import { apiClient, Paginated } from '../../lib/api'
import type { campaignsLogicType } from './campaignsLogicType'

export type CampaignsProps = {
    projectId: number
}

const campaignsApiClient: CampaignsApiClientInterface = new CampaignsApiClient(apiClient)

const campaignsLogic = kea<campaignsLogicType>([
    props({} as CampaignsProps),
    path(['scenes', 'campaigns', 'campaignsLogic']),
    defaults({
        campaigns: {} as Paginated<Campaign>,
    }),
    actions({
        loadCampaigns: () => ({}),
    }),
    loaders(({ props }) => ({
        campaigns: {
            loadCampaigns: async () => {
                return await campaignsApiClient.getCampaigns(props.projectId)
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadCampaigns()
    }),
])

export default campaignsLogic

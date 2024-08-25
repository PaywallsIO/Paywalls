import { afterMount, kea, path, actions, defaults, props, selectors, key } from 'kea'
import { loaders } from 'kea-loaders'
import { Campaign, campaignsApiClient } from './data/CampaignsApiClient'
import { Paginated } from '../../lib/api'
import type { campaignsLogicType } from './campaignsLogicType'

export type CampaignsProps = {
    projectId: number
}

const campaignsLogic = kea<campaignsLogicType>([
    props({} as CampaignsProps),
    path((key) => ['scenes', 'campaigns', 'campaignsLogic', key]),
    key((props) => `campaigns-${props.projectId}`),
    defaults({
        campaigns: {} as Paginated<Campaign>,
    }),
    selectors({
        projectId: [
            () => [(_, props) => props],
            (props): number => props.projectId
        ],
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

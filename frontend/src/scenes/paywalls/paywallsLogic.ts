import { afterMount, kea, path, actions, defaults, props, selectors, key } from 'kea'
import { loaders } from 'kea-loaders'
import { Paywall, PaywallsApiClientInterface } from './data/PaywallsApiClient'
import { apiClient, Paginated } from '../../lib/api'
import { PaywallsApiClient } from './data/PaywallsApiClient'
import type { paywallsLogicType } from './paywallsLogicType'

const paywallsApiClient: PaywallsApiClientInterface = new PaywallsApiClient(apiClient)

export type PaywallsProps = {
    projectId: number
}

export const paywallsLogic = kea<paywallsLogicType>([
    props({} as PaywallsProps),
    path((key) => ['scenes', 'paywalls', 'paywallsLogic', key]),
    key((props) => `paywalls-${props.projectId}`),
    defaults({
        paywalls: {} as Paginated<Paywall>,
    }),
    actions({
        loadPaywalls: () => ({}),
    }),
    selectors({
        projectId: [
            () => [(_, props) => props],
            (props: PaywallsProps): number => props.projectId
        ],
    }),
    loaders(({ props }) => ({
        paywalls: {
            loadPaywalls: async () => {
                return await paywallsApiClient.getPaywalls(props.projectId)
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadPaywalls()
    }),
])
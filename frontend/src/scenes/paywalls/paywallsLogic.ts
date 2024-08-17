import { afterMount, kea, path, actions, defaults, props, selectors } from 'kea'
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
    path(['scenes', 'paywalls', 'paywallsLogic']),
    defaults({
        paywalls: {} as Paginated<Paywall>,
    }),
    actions({
        loadPaywalls: () => ({}),
    }),
    loaders(({ props }) => ({
        paywalls: {
            loadPaywalls: async () => {
                console.log(props)
                return await paywallsApiClient.getPaywalls(props.projectId)
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadPaywalls()
    }),
])
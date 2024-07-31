import { afterMount, kea, path, actions, defaults, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import { Paywall } from '../../types'
import { apiClient } from '../../lib/api'
import { PaywallsApiClient } from './data/PaywallsApiClient'
import type { paywallsLogicType } from './paywallsLogicType'

const paywallsApiClient = new PaywallsApiClient(apiClient)

const paywallsLogic = kea<paywallsLogicType>([
    path(['scenes', 'paywalls', 'paywallsLogic']),
    defaults({
        paywalls: [] as Paywall[]
    }),
    actions({
        loadPaywalls: () => ({}),
    }),
    loaders(({ }) => ({
        paywalls: {
            loadPaywalls: async () => {
                return await paywallsApiClient.getPaywalls()
            }
        }
    })),
    afterMount(({ actions }) => {
        actions.loadPaywalls()
    })
])

export default paywallsLogic

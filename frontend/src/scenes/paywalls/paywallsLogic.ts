import { afterMount, kea, path, actions, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import { Paywall } from '../../types'

import type { paywallsLogicType } from './paywallsLogicType'
import { api } from '../../lib/api'

const paywallsLogic = kea<paywallsLogicType>([
    path(['scenes', 'paywalls', 'paywallsLogic']),
    defaults({
        paywalls: [] as Paywall[]
    }),
    actions({
        loadPaywalls: () => ({})
    }),
    loaders(({ actions, values }) => ({
        paywalls: {
            loadPaywalls: async () => {
                return await api.paywalls.getPaywalls()
            }
        }
    })),
    afterMount(({ actions }) => {
        actions.loadPaywalls()
    })
])

export default paywallsLogic

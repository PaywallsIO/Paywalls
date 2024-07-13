import { afterMount, kea, path, actions, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import { Paywall } from '../../types'
import axios from 'axios'

import type { paywallsLogicType } from './paywallsLogicType'

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
                const response = await axios.get('/api/paywalls')
                return response.data
            }
        }
    })),
    afterMount(({ actions }) => {
        actions.loadPaywalls()
    })
])

export default paywallsLogic

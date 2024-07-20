import { afterMount, kea, path, actions, defaults } from 'kea'
import { loaders } from 'kea-loaders'
import { Paywall } from '../../types'

import type { dashboardLogicType } from './dashboardLogicType'

const dashboardLogic = kea<dashboardLogicType>([
    path(['scenes', 'paywalls', 'dashboardLogic']),
])

export default dashboardLogic

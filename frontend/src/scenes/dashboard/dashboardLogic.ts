import { kea, path } from 'kea'

import type { dashboardLogicType } from './dashboardLogicType'

const dashboardLogic = kea<dashboardLogicType>([
    path(['scenes', 'paywalls', 'dashboardLogic']),
])

export default dashboardLogic

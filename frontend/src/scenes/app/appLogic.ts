import { connect, kea, path, selectors } from 'kea'

import type { appLogicType } from './appLogicType'
import { userLogic } from '../userLogic'

export const appLogic = kea<appLogicType>([
    path(['src', 'scenes', 'app', 'App']),
    connect([userLogic]),
    selectors({
        showApp: [
            (s) => [
                userLogic.selectors.userLoading,
                userLogic.selectors.user
            ],
            (userLoading, user) => !userLoading || user
        ],
    })
])

import { afterMount, kea, path, actions, defaults, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import { ProjectApp, AppsApiClient } from './data/AppsApiClient'
import { apiClient } from '../../lib/api'
import type { appsLogicType } from './appsLogicType'

const appsApiClient = new AppsApiClient(apiClient)

const appsLogic = kea<appsLogicType>([
    path(['scenes', 'apps', 'appsLogic']),
    defaults({
        apps: {} as ProjectApp[],
    }),
    actions({
        loadApps: () => ({}),
    }),
    loaders(({ }) => ({
        apps: {
            loadApps: async () => {
                return await appsApiClient.getApps()
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadApps()
    }),
])

export default appsLogic

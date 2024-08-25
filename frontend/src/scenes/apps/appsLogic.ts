import { afterMount, kea, path, actions, defaults, props, key } from 'kea'
import { loaders } from 'kea-loaders'
import { ProjectApp, AppsApiClient, AppsApiClientInterface } from './data/AppsApiClient'
import { apiClient, Paginated } from '../../lib/api'
import type { appsLogicType } from './appsLogicType'

export type AppsProps = {
    projectId: number
}

const appsApiClient: AppsApiClientInterface = new AppsApiClient(apiClient)

export const appsLogic = kea<appsLogicType>([
    props({} as AppsProps),
    path((key) => ['scenes', 'apps', 'appsLogic', key]),
    key((props) => `apps-${props.projectId}`),
    defaults({
        apps: {} as Paginated<ProjectApp>,
    }),
    actions({
        loadApps: () => ({}),
    }),
    loaders(({ props }) => ({
        apps: {
            loadApps: async () => {
                return await appsApiClient.getApps(props.projectId)
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadApps()
    }),
])

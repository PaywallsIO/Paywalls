import { ApiClientInterface, Paginated } from "../../../lib/api"

export interface AppsApiClientInterface {
    getApps(projectId: number): Promise<Paginated<ProjectApp>>
    getApp(projectId: number, appId: number): Promise<ProjectApp>
}

export type ProjectApp = {
    id: number
    name: string
    bundle_id: string
    created_at: Date
    updated_at: Date
}

export class AppsApiClient implements AppsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getApps(projectId: number): Promise<Paginated<ProjectApp>> {
        return this.api.get(`/api/projects/${projectId}/apps`)
    }

    async getApp(projectId: number, appId: number): Promise<ProjectApp> {
        return this.api.get(`/api/projects/${projectId}/apps/${appId}`)
    }
}

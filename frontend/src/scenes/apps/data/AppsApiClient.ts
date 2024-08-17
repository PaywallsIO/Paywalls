import { ApiClientInterface, Paginated } from "../../../lib/api"

interface AppsApiClientInterface {
    getApps(): Promise<ProjectApp[]>
    getApp(id: string | number): Promise<ProjectApp>
}

export type ProjectApp = {
    id: number
    name: string
    created_at: Date
    updated_at: Date
}

export class AppsApiClient implements AppsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async getApps(): Promise<ProjectApp[]> {
        return this.api.get('/api/apps')
    }

    async getApp(id: string | number): Promise<ProjectApp> {
        return this.api.get(`/api/apps/${id}`)
    }
}

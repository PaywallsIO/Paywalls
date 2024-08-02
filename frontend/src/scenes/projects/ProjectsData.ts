import { ProjectData } from "grapesjs"
import { ApiClientInterface, Paginated } from "../../lib/api"

interface ProjectsApiClientInterface {
    fetchProjects(): Promise<ProjectsResponse>
    createProject(project: CreateProjectRequest): Promise<void>
}

interface ProjectsRepositoryInterface {
    getProjects(): Promise<Project[]>
    createProject(project: CreateProjectRequest): Promise<void>
}

export type ProjectType = {
    id: number
    name: string
    avatar_url: string | null
    initials: string
    portal_id: number
    restore_behavior: string
    created_at: Date
}
export type ProjectsResponse = ProjectType[]

export class Project {
    constructor(
        public id: number,
        public name: string,
        public avatar_url: string | null,
        public portal_id: number,
        public restoreBehavior: string,
        public created_at: Date
    ) { }

    get initials(): string {
        return this.name
            .split(' ')
            .map((name) => name[0])
            .join('')
            .toUpperCase()
    }
}

export type CreateProjectRequest = {
    name: string
}

export class ProjectsApiClient implements ProjectsApiClientInterface {
    constructor(public api: ApiClientInterface) { }

    async fetchProjects(): Promise<ProjectsResponse> {
        return this.api.get('/api/projects')
    }

    async createProject(project: CreateProjectRequest): Promise<void> {
        await this.api.post('/api/projects', project)
    }
}

export class ProjectsRepository implements ProjectsRepositoryInterface {
    constructor(public api: ProjectsApiClientInterface) { }

    async getProjects(): Promise<Project[]> {
        let projects = await this.api.fetchProjects()
        return projects
            .map((project) => new Project(
                project.id,
                project.name,
                project.avatar_url,
                project.portal_id,
                project.restore_behavior,
                project.created_at
            ))
    }

    async createProject(project: CreateProjectRequest): Promise<void> {
        await this.api.createProject(project)
    }
}

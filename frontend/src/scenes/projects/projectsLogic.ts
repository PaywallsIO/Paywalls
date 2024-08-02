import { afterMount, kea, path, actions, defaults, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import { Project, ProjectsApiClient, ProjectsRepository } from './ProjectsData'
import type { projectsLogicType } from './projectsLogicType'
import { apiClient } from '../../lib/api'

const projectsApiClient = new ProjectsApiClient(apiClient)
const projectsRepository = new ProjectsRepository(projectsApiClient)

const projectsLogic = kea<projectsLogicType>([
    path(['scenes', 'projects', 'projectsLogic']),
    defaults({
        projects: [] as Project[],
    }),
    loaders(({ }) => ({
        projects: {
            loadProjects: async () => {
                return await projectsRepository.getProjects()
            },
        },
    })),
    afterMount(({ actions }) => {
        actions.loadProjects()
    }),
])

export default projectsLogic

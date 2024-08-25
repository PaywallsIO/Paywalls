import { kea, path } from 'kea'
import { forms } from 'kea-forms'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { modals } from '@mantine/modals'
import { CreateProjectRequest, ProjectsApiClient, ProjectsRepository } from '../ProjectsData'
import { apiClient } from '../../../lib/api'

import type { createProjectLogicType } from './createProjectLogicType'
import projectsLogic from '../projectsLogic'

const projectApiClient = new ProjectsApiClient(apiClient)
const projectRepository = new ProjectsRepository(projectApiClient)

const createProjectLogic = kea<createProjectLogicType>([
    path(['scenes', 'paywalls', 'create', 'createPaywallLogicType']),
    forms(({ actions }) => ({
        createProjectForm: {
            defaults: {
                name: '',
            } as CreateProjectRequest,
            errors: ({ name }: CreateProjectRequest) => ({
                name: !name ? 'A name is required' : null,
            }),
            submit: async ({ name }) => {
                try {
                    await projectRepository.createProject({ name })

                    modals.closeAll()
                    actions.resetCreateProjectForm()
                    projectsLogic.actions.loadProjects()

                    notifications.show({
                        color: 'green',
                        title: 'Success',
                        message: 'Project created',
                        radius: 'md',
                    })
                } catch (error: any) {
                    notifications.show({
                        color: 'red',
                        title: 'Error',
                        message: 'Something went wrong. Please try again.',
                        radius: 'md',
                    })
                }
            },
        },
    })),
])

export default createProjectLogic

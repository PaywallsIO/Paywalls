import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import type { createPaywallLogicType } from './createPaywallLogicType'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { modals } from '@mantine/modals'
import { CreatePaywallRequest, PaywallsApiClient } from '../data/PaywallsApiClient'
import { apiClient } from '../../../lib/api'

const paywallsApiClient = new PaywallsApiClient(apiClient)

export type CreatePaywallProps = {
    projectId: number
}

const createPaywallLogic = kea<createPaywallLogicType>([
    path((key) => ['scenes', 'paywalls', 'create', 'createPaywallLogic', key]),
    key((props) => `create-paywall-${props.projectId}`),
    props({} as CreatePaywallProps),
    forms(({ props, actions }) => ({
        createPaywallForm: {
            defaults: {
                name: '',
            } as CreatePaywallRequest,
            errors: ({ name }: CreatePaywallRequest) => ({
                name: !name ? 'A name is required' : null,
            }),
            submit: async (request: CreatePaywallRequest) => {
                try {
                    const response = await paywallsApiClient.create(props.projectId, request)

                    modals.closeAll()
                    actions.resetCreatePaywallForm()
                    router.actions.push(`/projects/${props.projectId}/paywalls/${response.id}/editor`)
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

export default createPaywallLogic

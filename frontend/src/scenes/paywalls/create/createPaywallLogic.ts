import { kea, path } from 'kea'
import { forms } from 'kea-forms'
import type { createPaywallLogicType } from './createPaywallLogicType'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { modals } from '@mantine/modals'
import { CreatePaywallRequest, PaywallsApiClient } from '../data/PaywallsApiClient'
import { apiClient } from '../../../lib/api'

const paywallsApiClient = new PaywallsApiClient(apiClient)

const createPaywallLogic = kea<createPaywallLogicType>([
    path(['scenes', 'paywalls', 'create', 'createPaywallLogicType']),
    forms(({ actions }) => ({
        createPaywallForm: {
            defaults: {
                name: '',
            } as CreatePaywallRequest,
            errors: ({ name }: CreatePaywallRequest) => ({
                password: !name ? 'A name is required' : null,
            }),
            submit: async ({ name }) => {
                try {
                    const response = await paywallsApiClient.create({ name })

                    modals.closeAll()
                    actions.resetCreatePaywallForm()
                    router.actions.push(`/editor/${response.id}`)
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
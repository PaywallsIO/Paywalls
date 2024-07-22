import { kea, path } from 'kea'
import { forms } from 'kea-forms'
import type { createPaywallLogicType } from './createPaywallLogicType'
import { notifications } from '@mantine/notifications'
import { api } from '../../../lib/api'
import { router } from 'kea-router'

export type CreatePaywallForm = {
    name: string
}

const createPaywallLogic = kea<createPaywallLogicType>([
    path(['scenes', 'paywalls', 'create', 'createPaywallLogicType']),
    forms(({ actions }) => ({
        createPaywallForm: {
            defaults: {
                name: '',
            } as CreatePaywallForm,
            errors: ({ name }: CreatePaywallForm) => ({
                password: !name ? 'A name is required' : null,
            }),
            submit: async ({ name }) => {
                try {
                    const response = await api.paywalls.create({ name })

                    router.actions.push(`/editor/${response.id}`)
                    actions.resetCreatePaywallForm()
                } catch (error: any) {
                    notifications.show({
                        color: 'red',
                        title: 'Error',
                        message: 'TODO error handling',
                        radius: 'md',
                    })
                }
            },
        },
    })),
])

export default createPaywallLogic
import { kea, path } from 'kea'
import { forms } from 'kea-forms'
import type { createPaywallLogicType } from './createPaywallLogicType'
import { notifications } from '@mantine/notifications'
import { api } from '../../../lib/api'
import { router } from 'kea-router'
import { modals } from '@mantine/modals'

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
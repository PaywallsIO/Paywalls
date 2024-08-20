import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import { notifications } from '@mantine/notifications'
import type { audienceLogicType } from './audienceLogicType'
import { CampaignAudience } from '../data/CampaignsApiClient'

type AudienceRequest = {
    filters: Object
    matchLimit: string | number
}

type AudienceProps = {
    audience: CampaignAudience
}

export const audienceLogic = kea<audienceLogicType>([
    props({} as AudienceProps),
    key((props) => props.audience.id),
    path((key) => ['scenes', 'audience', 'audienceLogic', key]),
    forms(({ actions }) => ({
        audienceForm: {
            defaults: {
                filters: [],
                matchLimit: "",
            } as AudienceRequest,
            errors: (request: AudienceRequest) => ({
                // no-op
            }),
            submit: async (request: AudienceRequest) => {
                console.log(request)
                // try {
                //     const csrfToken = await authApiClient.csrfToken()
                //     const response = await authApiClient.login({ email, password })

                //     userLogic.actions.loadUser()

                //     notifications.show({
                //         color: 'green',
                //         title: '👋 Welcome back!',
                //         message: 'Great to see you.',
                //         radius: 'md',
                //     })
                //     actions.resetLoginForm()
                // } catch (error: any) {
                //     notifications.show({
                //         color: 'red',
                //         title: 'Error',
                //         message: 'Could not login. Please try again',
                //         radius: 'md',
                //     })
                // }
            },
        },
    })),
])
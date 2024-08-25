import { kea, key, path, props, selectors } from 'kea'
import { forms } from 'kea-forms'
import { notifications } from '@mantine/notifications'
import type { audienceLogicType } from './audienceLogicType'
import {
    AudienceRequest,
    CampaignAudience,
    campaignsApiClient,
    CampaignsApiClient,
    CampaignsApiClientInterface,
} from '../data/CampaignsApiClient'

export type AudienceProps = {
    projectId: number
    audience: CampaignAudience
}

export const audienceLogic = kea<audienceLogicType>([
    props({} as AudienceProps),
    key((props) => props.audience.id),
    path((key) => ['scenes', 'audience', 'audienceLogic', key]),
    selectors({
        audience: [() => [(_, props) => props], (props): CampaignAudience => props.audience],
    }),
    forms(({ props }) => ({
        audienceForm: {
            defaults: {
                filters: props.audience.filters,
                match_limit: props.audience.match_limit,
                match_period: props.audience.match_period,
            } as AudienceRequest,
            errors: (request: AudienceRequest) => ({
                // no-op
            }),
            submit: async (request: AudienceRequest) => {
                try {
                    const response = await campaignsApiClient.saveAudience(props.projectId, props.audience, request)

                    notifications.show({
                        color: 'green',
                        title: 'Audience saved',
                        message: '',
                        radius: 'md',
                    })
                } catch (error: any) {
                    notifications.show({
                        color: 'red',
                        title: 'Error',
                        message: 'Error saving audience. Please try again',
                        radius: 'md',
                    })
                }
            },
        },
    })),
])
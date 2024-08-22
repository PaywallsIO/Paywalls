import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import { notifications } from '@mantine/notifications'
import type { audienceLogicType } from './audienceLogicType'
import { AudienceRequest, CampaignAudience, CampaignsApiClient, CampaignsApiClientInterface } from '../data/CampaignsApiClient'
import { apiClient } from '../../../lib/api'

const campaignApiClient: CampaignsApiClientInterface = new CampaignsApiClient(apiClient)

type AudienceProps = {
    projectId: number
    audience: CampaignAudience
}

export const audienceLogic = kea<audienceLogicType>([
    props({} as AudienceProps),
    key((props) => props.audience.id),
    path((key) => ['scenes', 'audience', 'audienceLogic', key]),
    forms(({ props, actions }) => ({
        audienceForm: {
            defaults: {
                filters: [],
                matchLimit: null,
                matchPeriod: null
            } as AudienceRequest,
            errors: (request: AudienceRequest) => ({
                // no-op
            }),
            submit: async (request: AudienceRequest) => {
                console.log(request)
                try {
                    const response = await campaignApiClient.saveAudience(
                        props.projectId,
                        props.audience.id,
                        request
                    )

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
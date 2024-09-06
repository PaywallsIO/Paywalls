import { afterMount, kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import type { attachCampaignPaywallLogicType } from './attachCampaignPaywallLogicType'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { AttachCampaignPaywallRequest, campaignsApiClient } from '../data/CampaignsApiClient'
import { loaders } from 'kea-loaders'
import { paywallsApiClient } from '../../paywalls/data/PaywallsApiClient'

export type AttachCampaignPaywallProps = {
    projectId: number
    campaignId: number
    currentPaywallIds: number[]
    completion?: () => void
}

export const attachCampaignPaywallLogic = kea<attachCampaignPaywallLogicType>([
    path((key) => ['scenes', 'campaign', 'attach', 'attachCampaignPaywallLogic', key]),
    key((props) => `attach-paywall-project:${props.projectId}-campaign:${props.campaignId}`),
    props({} as AttachCampaignPaywallProps),
    loaders(({ props }) => ({
        paywalls: {
            loadPaywalls: async () => {
                return await paywallsApiClient.getPaywalls(props.projectId)
            },
            searchPaywalls: async (search: string) => {
                return await paywallsApiClient.getPaywalls(props.projectId, search)
            }
        },
    })),
    forms(({ props, actions }) => ({
        attachCampaignPaywallForm: {
            defaults: {
                paywall_id: null
            } as AttachCampaignPaywallRequest,
            errors: ({ paywall_id }: AttachCampaignPaywallRequest) => ({
                paywall_id: !paywall_id ? 'A paywall is required' : null,
            }),
            submit: async (request: AttachCampaignPaywallRequest) => {
                try {
                    await campaignsApiClient.attachPaywall(props.projectId, props.campaignId, request)

                    modals.closeAll()
                    actions.resetAttachCampaignPaywallForm()
                    props.completion?.()
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
    afterMount(({ actions }) => {
        actions.loadPaywalls()
    })
])

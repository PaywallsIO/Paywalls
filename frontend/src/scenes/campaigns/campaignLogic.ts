import { afterMount, kea, path, actions, defaults, key, props, selectors, listeners } from 'kea'
import { loaders } from 'kea-loaders'
import { Campaign, campaignsApiClient, EditTriggerRequest, PaywallPercentageRequest, UpdateSortOrderRequest } from './data/CampaignsApiClient'
import type { campaignLogicType } from './campaignLogicType'
import { notifications } from '@mantine/notifications'
import { undoNotificationMessage } from './Campaign'
import { forms } from 'kea-forms'

export type CampaignProps = {
    projectId: number
    campaignId: number
}

export const campaignLogic = kea<campaignLogicType>([
    props({} as CampaignProps),
    path((key) => ['scenes', 'campaigns', 'campaignLogic', key]),
    key((props) => props.campaignId),
    defaults({
        campaign: {} as Campaign,
    }),
    selectors({
        projectId: [() => [(_, props) => props], (props): number => props.projectId],
        campaignId: [() => [(_, props) => props], (props): number => props.campaignId],
    }),
    actions({
        deleteAudience: (audienceId) => ({ audienceId }),
        restoreAudience: (audienceId: number) => ({ audienceId }),
        restoreTrigger: (triggerId: number) => ({ triggerId }),
        updateTrigger: ({ triggerId, request }: { triggerId: number, request: EditTriggerRequest }) => ({ triggerId, request }),
        deleteTrigger: (triggerId: number) => ({ triggerId })
    }),
    listeners(({ props, actions }) => ({
        restoreTrigger: async ({ triggerId }: { triggerId: number }) => {
            try {
                await campaignsApiClient.restoreTrigger(props.projectId, props.campaignId, triggerId)
                actions.loadCampaign()

                notifications.show({
                    color: 'green',
                    title: 'Trigger restored',
                    message: '',
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
        deleteTrigger: async ({ triggerId }: { triggerId: number }) => {
            try {
                await campaignsApiClient.deleteTrigger(props.projectId, props.campaignId, triggerId)
                actions.loadCampaign()

                notifications.show({
                    id: 'trigger-deleted-toast',
                    autoClose: 5000,
                    color: 'green',
                    title: 'Trigger deleted.',
                    message: undoNotificationMessage('The trigger was deleted.', () => {
                        notifications.hide('trigger-deleted-toast')
                        actions.restoreTrigger(triggerId)
                    }),
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
        updateTrigger: async ({ triggerId, request }: { triggerId: number, request: EditTriggerRequest }) => {
            try {
                await campaignsApiClient.updateTrigger(props.projectId, props.campaignId, triggerId, request)
                actions.loadCampaign()

                notifications.show({
                    color: 'green',
                    title: 'Trigger updated',
                    message: '',
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
        restoreAudience: async ({ audienceId }: { audienceId: number }) => {
            try {
                await campaignsApiClient.restoreAudience(props.projectId, props.campaignId, audienceId)
                actions.loadCampaign()

                notifications.show({
                    color: 'green',
                    title: 'Audience restored',
                    message: '',
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
        deleteAudience: async ({ audienceId }: { audienceId: number }) => {
            try {
                await campaignsApiClient.deleteAudience(props.projectId, props.campaignId, audienceId)
                actions.loadCampaign()

                notifications.show({
                    id: 'audience-deleted-toast',
                    autoClose: 5000,
                    color: 'green',
                    title: 'Audience Deleted',
                    message: undoNotificationMessage('The audience was deleted.', () => {
                        notifications.hide('audience-deleted-toast')
                        actions.restoreAudience(audienceId)
                    }),
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
        loadCampaignSuccess: ({ campaign }: { campaign: Campaign }) => {
            actions.setPaywallPercentageFormValues({
                paywalls: campaign.paywalls.map((p) => ({ id: p.id, percentage: p.pivot.percentage })) || []
            })
        }
    })),
    forms(({ props, actions, values }) => ({
        paywallPercentageForm: {
            defaults: {
                paywalls: []
            } as PaywallPercentageRequest,
            errors: ({ paywalls }: PaywallPercentageRequest) => ({
                paywalls: paywalls.map((p) => {
                    const sum = paywalls.reduce((acc, cur) => parseInt(String(acc + cur.percentage)), 0)
                    if (sum > 100) {
                        return {
                            id: null,
                            percentage: `Total (${sum}) must less than 100`,
                        }
                    }

                    return {
                        id: null,
                        percentage: p.percentage < 0 || p.percentage > 100 ? `Must be between 0 and 100` : null,
                    }
                }),
            }),
            submit: async (request: PaywallPercentageRequest) => {
                try {
                    await campaignsApiClient.paywallPercentages(props.projectId, props.campaignId, request)

                } catch (error: any) {
                    notifications.show({
                        color: 'red',
                        title: 'Error',
                        message: 'Something went wrong. Please try again.',
                        radius: 'md',
                    })
                }
            },
            options: {
                alwaysShowErrors: true,
            }
        }
    })),
    loaders(({ props }) => ({
        campaign: {
            loadCampaign: async () => {
                return await campaignsApiClient.getCampaign(props.projectId, props.campaignId)
            },
            updateSortOrder: async (request: UpdateSortOrderRequest) => {
                return await campaignsApiClient.updateSortOrder(props.projectId, props.campaignId, request)
            }
        },
    })),
    afterMount(({ actions }) => {
        actions.loadCampaign()
    }),
])

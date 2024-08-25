import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { CreateTriggerRequest, campaignsApiClient } from '../../data/CampaignsApiClient'
import type { createTriggerLogicType } from './createTriggerLogicType'

export type CreateTriggerProps = {
  projectId: number
  campaignId: number
  completion?: () => void
}

export const createTriggerLogic = kea<createTriggerLogicType>([
  props({} as CreateTriggerProps),
  path((key) => ['scenes', 'campaigns', 'triggers', 'createTriggerLogic', key]),
  key((props) => `create-trigger-${props.projectId}-${props.campaignId}`),
  forms(({ props, actions }) => ({
    createTriggerForm: {
      defaults: {
        event_name: '',
      } as CreateTriggerRequest,
      errors: ({ event_name }: CreateTriggerRequest) => ({
        event_name: !event_name ? 'Event name is required' : null,
      }),
      submit: async (request: CreateTriggerRequest) => {
        try {
          const response = await campaignsApiClient.createTrigger(props.projectId, props.campaignId, request)

          notifications.show({
            color: 'green',
            title: 'Trigger created',
            message: '',
            radius: 'md',
          })

          modals.closeAll()
          actions.resetCreateTriggerForm
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
])

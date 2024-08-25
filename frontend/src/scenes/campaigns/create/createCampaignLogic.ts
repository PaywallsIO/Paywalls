import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import type { createCampaignLogicType } from './createCampaignLogicType'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { modals } from '@mantine/modals'
import { campaignsApiClient, CreateCampaignRequest } from '../data/CampaignsApiClient'

type CreateCampaignProps = {
  projectId: number
}

export const createCampaignLogic = kea<createCampaignLogicType>([
  path((key) => ['scenes', 'campaigns', 'create', 'createCampaignLogic', key]),
  key((props) => `create-campaign-${props.projectId}`),
  props({} as CreateCampaignProps),
  forms(({ props, actions }) => ({
    createCampaignForm: {
      defaults: {
        name: '',
      } as CreateCampaignRequest,
      errors: ({ name }: CreateCampaignRequest) => ({
        name: !name ? 'A name is required' : null,
      }),
      submit: async (request: CreateCampaignRequest) => {
        try {
          const response = await campaignsApiClient.create(props.projectId, request)

          modals.closeAll()
          actions.resetCreateCampaignForm()
          router.actions.push(`/projects/${props.projectId}/campaigns/${response.id}`)
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

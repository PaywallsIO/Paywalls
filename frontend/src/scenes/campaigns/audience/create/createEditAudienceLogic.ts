import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import type { createEditAudienceLogicType } from './createEditAudienceLogicType'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { CreateEditAudienceRequest, CampaignAudience, campaignsApiClient } from '../../data/CampaignsApiClient'

interface CreateAudienceProps {
  isEditing: false
  projectId: number
  campaignId: number
  completion?: () => void
}

interface EditAudienceProps {
  isEditing: true
  projectId: number
  campaignId: number
  audience: CampaignAudience
  completion?: () => void
}

export type CreateEditAudienceProps = CreateAudienceProps | EditAudienceProps

export const createEditAudienceLogic = kea<createEditAudienceLogicType>([
  props({} as CreateEditAudienceProps),
  path((key) => ['scenes', 'campaigns', 'audience', 'createEditAudienceLogic', key]),
  key((props) => `create-edit-audience-${props.projectId}-${props.campaignId}`),
  forms(({ props, actions }) => ({
    createEditAudienceForm: {
      defaults: {
        name: props.isEditing ? props.audience.name : '',
      } as CreateEditAudienceRequest,
      errors: ({ name }: CreateEditAudienceRequest) => ({
        name: !name ? 'A name is required' : null,
      }),
      submit: async (request: CreateEditAudienceRequest) => {
        try {
          if (props.isEditing) {
            const response = await campaignsApiClient.saveAudience(props.projectId, props.audience, request)
          } else {
            const response = await campaignsApiClient.createAudience(props.projectId, props.campaignId, request)
          }

          modals.closeAll()
          actions.resetCreateEditAudienceForm()
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

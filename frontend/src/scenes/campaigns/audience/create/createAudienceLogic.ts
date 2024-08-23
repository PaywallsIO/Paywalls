import { kea, key, path, props } from 'kea'
import { forms } from 'kea-forms'
import type { createAudienceLogicType } from './createAudienceLogicType'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { CreateAudienceRequest, CampaignsApiClient, CampaignsApiClientInterface } from '../../data/CampaignsApiClient'
import { apiClient } from '../../../../lib/api'
import { campaignLogic } from '../../campaignLogic'

const campaignsApiClient: CampaignsApiClientInterface = new CampaignsApiClient(apiClient)

export type CreateAudienceProps = {
  projectId: number
  campaignId: number
}

export const createAudienceLogic = kea<createAudienceLogicType>([
  props({} as CreateAudienceProps),
  path((key) => ['scenes', 'campaigns', 'audience', 'create', 'createAudienceLogic', key]),
  key((props) => `create-audience-${props.projectId}-${props.campaignId}`),
  forms(({ props, actions }) => ({
    createAudienceForm: {
      defaults: {
        name: '',
      } as CreateAudienceRequest,
      errors: ({ name }: CreateAudienceRequest) => ({
        name: !name ? 'A name is required' : null,
      }),
      submit: async (request: CreateAudienceRequest) => {
        try {
          const response = await campaignsApiClient.createAudience(props.projectId, props.campaignId, request)
          const parentLogic = campaignLogic({ projectId: props.projectId, campaignId: props.campaignId })

          modals.closeAll()
          actions.resetCreateAudienceForm()
          parentLogic.actions.loadCampaign()
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
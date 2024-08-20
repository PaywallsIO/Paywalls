import { kea, path } from 'kea'
import { forms } from 'kea-forms'
import type { createCampaignLogicType } from './createCampaignLogicType'
import { notifications } from '@mantine/notifications'
import { router } from 'kea-router'
import { modals } from '@mantine/modals'
import { CreateCampaignRequest, CampaignsApiClient, CampaignsApiClientInterface } from '../data/CampaignsApiClient'
import { apiClient } from '../../../lib/api'

const campaignsApiClient: CampaignsApiClientInterface = new CampaignsApiClient(apiClient)

const createCampaignLogic = kea<createCampaignLogicType>([
  path(['scenes', 'campaigns', 'create', 'createCampaignLogic']),
  forms(({ actions }) => ({
    createCampaignForm: {
      defaults: {
        name: '',
      } as CreateCampaignRequest,
      errors: ({ name }: CreateCampaignRequest) => ({
        name: !name ? 'A name is required' : null,
      }),
      submit: async ({ name }) => {
        try {
          const response = await campaignsApiClient.create({ name })

          modals.closeAll()
          actions.resetCreateCampaignForm()
          router.actions.push(`/campaigns/${response.id}`)
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

export default createCampaignLogic

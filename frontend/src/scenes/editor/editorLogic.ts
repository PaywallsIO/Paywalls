import { kea, path, actions, defaults, props, key, afterMount, selectors, listeners } from 'kea'

import type { editorLogicType } from './editorLogicType'
import { apiClient } from '../../lib/api'
import { loaders } from 'kea-loaders'
import { notifications } from '@mantine/notifications'
import { PaywallsApiClient } from '../paywalls/data/PaywallsApiClient'

const paywallsApiClient = new PaywallsApiClient(apiClient)

export type EditorProps = {
  id: string | number
}

export const editorLogic = kea<editorLogicType>([
  props({} as EditorProps),
  path((key) => ['scenes', 'editor', 'editorLogic', key]),
  key(({ id }) => id),
  selectors({
    paywallId: [() => [(_, props) => props], (props): string => props.id],
  }),
  loaders(({ props, values }) => ({
    paywall: {
      loadPaywall: async () => {
        return await paywallsApiClient.getPaywall(values.paywallId)
      },
      storePaywall: async (data) => {
        return await paywallsApiClient.update({
          id: props.id,
          data: {
            version: values.paywall.version,
            content: data
          }
        })
      }
    }
  })),
  listeners(({ actions }) => ({
    storePaywallFailure: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error saving paywall',
        message: error.errorObject.detail,
        radius: 'md',
      })
    }
  })),
  afterMount(({ actions }) => {
    actions.loadPaywall()
  })
])
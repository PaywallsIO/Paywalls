import { kea, path, actions, defaults, props, key, afterMount, selectors, listeners } from 'kea'

import type { editorLogicType } from './editorLogicType'
import { ApiError, api } from '../../lib/api'
import { loaders } from 'kea-loaders'
import { notifications } from '@mantine/notifications'

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
        return await api.paywalls.getPaywall(values.paywallId)
      }
    },
    updatedPaywall: {
      storePaywall: async (data) => {
        return await api.paywalls.update({
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
        message: (error.errorObject as ApiError).detail,
        radius: 'md',
      })
    }
  })),
  afterMount(({ actions }) => {
    actions.loadPaywall()
  })
])
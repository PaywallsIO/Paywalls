import { kea, path, actions, defaults, props, key, afterMount, selectors, listeners } from 'kea'

import type { editorLogicType } from './editorLogicType'
import { apiClient } from '../../lib/api'
import { loaders } from 'kea-loaders'
import { notifications } from '@mantine/notifications'
import { PaywallsApiClient, PaywallsApiClientInterface } from '../paywalls/data/PaywallsApiClient'

const paywallsApiClient: PaywallsApiClientInterface = new PaywallsApiClient(apiClient)

export type EditorProps = {
  projectId: number
  paywallId: number
}

export const editorLogic = kea<editorLogicType>([
  props({} as EditorProps),
  path((key) => ['scenes', 'editor', 'editorLogic', key]),
  key(({ paywallId }) => paywallId),
  selectors({
    paywallId: [() => [(_, props) => props], (props): number => props.paywallId],
    projectId: [() => [(_, props) => props], (props): number => props.projectId],
  }),
  loaders(({ props, values }) => ({
    paywall: {
      loadPaywall: async () => {
        return await paywallsApiClient.getPaywall(props.projectId, values.paywallId)
      },
      storePaywall: async (data) => {
        return await paywallsApiClient.update(props.projectId, {
          id: props.paywallId,
          data: {
            version: values.paywall.version,
            content: data
          }
        })
      }
    },
    publishPaywall: {
      publishPaywall: async (data: { html: string, css: string, js: string }) => {
        await paywallsApiClient.publish(props.projectId, {
          id: props.paywallId,
          version: values.paywall.version,
          ...data
        })
        return true
      }
    }
  })),
  listeners(({ actions }) => ({
    storePaywallFailure: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error saving paywall',
        message: error.errorObject.response.data.message || 'Something went wrong. Please try again.',
        radius: 'md',
      })
    },
    publishPaywallFailure: (error) => {
      notifications.show({
        color: 'red',
        title: 'Error publishing paywall',
        message: 'Something went wrong. Please try again.',
        radius: 'md',
      })
    },
    publishPaywallSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Paywall Published',
        message: null,
        radius: 'md',
      })
    },
  })),
  afterMount(({ actions }) => {
    actions.loadPaywall()
  })
])
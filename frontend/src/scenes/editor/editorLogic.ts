import { kea, path, actions, defaults, props, key, afterMount, selectors } from 'kea'
import { grapesjs } from 'grapesjs'

import type { editorLogicType } from './editorLogicType'
import { api } from '../../lib/api'
import { useEffect } from 'react'
import { loaders } from 'kea-loaders'
import { Paywall } from '../../types'

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
      },
      storePaywall: async (data): Promise<Paywall> => {
        return await api.paywalls.updateContent({
          id: props.id,
          data: {
            version: values.paywall.version,
            content: data
          }
        })
      }
    }
  })),
  afterMount(({ actions }) => {
    actions.loadPaywall()
  })
])
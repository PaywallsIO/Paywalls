import { kea, path, actions, defaults, props, key, afterMount, selectors } from 'kea'
import { grapesjs } from 'grapesjs'

import type { editorLogicType } from './editorLogicType'
import { api } from '../../lib/api'
import { useEffect } from 'react'

export type EditorProps = {
  id: string | number
}

export const editorLogic = kea<editorLogicType>([
  props({} as EditorProps),
  key(({ id }) => `paywall-${id}`),
  path(['scenes', 'editor', 'editorLogic']),
  selectors({
    paywallId: [() => [(_, props) => props], (props): string => props.id],
    version: [() => [() => true], () => 1],
  }),
  afterMount(({ props }) => {

  })
])
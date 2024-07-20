import { kea, path, actions, defaults } from 'kea'
import { loaders } from 'kea-loaders'

import type { editorLogicType } from './editorLogicType'

const editorLogic = kea<editorLogicType>([
  path(['scenes', 'editor', 'editorLogic']),
  defaults({}),
  actions({}),
  loaders(({ }) => ({})),
])

export default editorLogic
